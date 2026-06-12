# Requirements: OCI + Cloudflare Deployment

## Introduction

This spec covers the full deployment of the Jemeka Tours monorepo (Next.js web app + Hono/tRPC API) onto Oracle Cloud Infrastructure (OCI) Free Tier compute with Cloudflare Free Tier as the CDN, DNS, and TLS termination layer. The architecture is designed to be multi-application-ready so that future apps can be deployed into the same OCI account and Cloudflare zone without rework.

**Scope:** Infrastructure-as-code, container packaging, OCI provisioning, Cloudflare configuration, CI/CD deployment pipeline, monitoring, and a repeatable deployment playbook.

**Constraints:**
- OCI Free Tier: 4 Arm (Ampere A1) VMs — 4 total OCPUs, 24 GB RAM; 200 GB block storage; 10 GB object storage; 1 flexible load balancer (10 Mbps); always-free Autonomous Database (not used here — Turso is used instead).
- Cloudflare Free Tier: 1 zone, unlimited DNS records, Universal SSL, basic WAF, Workers (100k req/day), Pages, R2 (10 GB), unlimited proxied traffic.
- No paid add-ons to either service.

---

## Glossary

| Term | Definition |
|---|---|
| VCN | Virtual Cloud Network — OCI's private network construct |
| NSG | Network Security Group — OCI stateful firewall attached to individual resources |
| OCIR | OCI Container Image Registry — stores Docker images |
| Compartment | OCI logical container for resource organisation and IAM scoping |
| Cloudflare Proxy | Cloudflare's reverse-proxy mode (orange cloud) that hides origin IP and provides CDN/WAF |
| Turso | LibSQL cloud database service used as the production SQLite backend |
| `docker-compose.yml` | Compose file used on the OCI VM to orchestrate the `api` and `web` containers |
| Caddy | Lightweight reverse-proxy / TLS termination server run as a container on the VM |
| OCI Vault | OCI secrets management service (free tier: up to 20 secrets) |
| `fly.io` | Alternative PaaS — **not used** in this spec; Turso remote DB URL is the only external service |

---

## Requirements

### Requirement 1: Codebase Containerisation

**User Story:** As a developer, I want both applications packaged as Docker images so they can be deployed reproducibly to any OCI compute instance.

#### Acceptance Criteria

1. WHEN `apps/api/Dockerfile` is created, THEN it SHALL use a multi-stage build: `node:22-alpine` builder stage compiles TypeScript, and a lean `node:22-alpine` runner stage copies only `dist/` and `node_modules` (production deps only).
2. WHEN `apps/web/Dockerfile` is created, THEN it SHALL use a multi-stage build: builder runs `next build` (with `output: "standalone"` set in `next.config.ts`), and the runner stage copies `.next/standalone`, `.next/static`, and `public/`.
3. WHEN `next.config.ts` is updated for standalone output, THEN `output: "standalone"` SHALL be added to the Next.js config so the image does not require the full `node_modules` at runtime.
4. WHEN a `docker-compose.yml` is created at the repo root, THEN it SHALL define four services: `api`, `web`, `caddy`, and optionally `watchtower` for auto-pull of updated images.
5. WHEN `docker-compose.yml` is created, THEN all secrets SHALL be injected via environment variable references (e.g., `${DATABASE_URL}`) sourced from a `.env` file that is gitignored, NOT hardcoded in the compose file.
6. WHEN `docker build` is run for either image, THEN the resulting image SHALL pass `docker run --rm image healthcheck-command` without error.
7. WHEN a `.dockerignore` is created for each app, THEN it SHALL exclude `node_modules`, `.next/cache`, `*.db`, `.env*`, and `dist/` from the build context to keep image layers small.

---

### Requirement 2: OCI Account & Compartment Structure

**User Story:** As an operator, I want a clean OCI compartment hierarchy so that resources for different applications are isolated, access-controlled, and easy to track.

#### Acceptance Criteria

1. WHEN the OCI account is set up, THEN a root compartment named `jemeka-prod` SHALL be created under the tenancy root to hold all production resources.
2. WHEN compartments are structured, THEN a child compartment `jemeka-prod/network` SHALL exist for VCN, subnets, and gateways.
3. WHEN compartments are structured, THEN a child compartment `jemeka-prod/compute` SHALL exist for VM instances and block volumes.
4. WHEN compartments are structured, THEN a child compartment `jemeka-prod/registry` SHALL exist for OCIR repositories.
5. WHEN a new future application is deployed, THEN it SHALL be placed in a new peer compartment (e.g., `jemeka-prod/app2`) without modifying existing resources.
6. WHEN IAM policies are written, THEN they SHALL be scoped to the specific compartment, NOT to the tenancy root, to enforce least-privilege.

---

### Requirement 3: OCI Networking (VCN)

**User Story:** As an operator, I want a VCN with public and private subnets so that the VM is reachable from the internet while internal services are isolated.

#### Acceptance Criteria

1. WHEN the VCN is created, THEN it SHALL use CIDR block `10.0.0.0/16`.
2. WHEN subnets are created, THEN a public subnet `10.0.1.0/24` SHALL exist for the compute instance (web/API VM).
3. WHEN subnets are created, THEN a private subnet `10.0.2.0/24` SHALL exist for future internal services (reserved; no resources placed here initially).
4. WHEN the internet gateway is attached, THEN only the public subnet's route table SHALL reference it.
5. WHEN Network Security Groups are configured, THEN the VM NSG SHALL allow: inbound TCP 80 from `0.0.0.0/0`, inbound TCP 443 from `0.0.0.0/0`, inbound TCP 22 from the operator's IP only (not `0.0.0.0/0`), and all outbound traffic.
6. WHEN Cloudflare proxying is active, THEN the NSG rule for TCP 443 SHOULD be further restricted to [Cloudflare's published IP ranges](https://www.cloudflare.com/ips/) only, hiding the origin IP.

---

### Requirement 4: OCI Compute Instance

**User Story:** As an operator, I want an Arm (Ampere A1) VM provisioned with Docker so it can run the containerised applications within the Free Tier budget.

#### Acceptance Criteria

1. WHEN the VM is provisioned, THEN it SHALL use the `VM.Standard.A1.Flex` shape with 2 OCPUs and 12 GB RAM (within the 4 OCPU / 24 GB free allocation), reserving headroom for future apps.
2. WHEN the VM is provisioned, THEN it SHALL run Oracle Linux 8 or Ubuntu 22.04 LTS (ARM64 image).
3. WHEN the VM boots for the first time, THEN a cloud-init script SHALL: install Docker Engine + Docker Compose plugin, create a `deploy` user with passwordless sudo for Docker commands, clone the deployment repo (or copy compose files), and start the `docker compose up -d` stack.
4. WHEN the VM is created, THEN an SSH key pair SHALL be generated and the public key attached; the private key SHALL be stored in OCI Vault.
5. WHEN a 50 GB block volume is created, THEN it SHALL be attached to the VM and mounted at `/data` for persistent container volumes (Caddy TLS certs, SQLite fallback, logs).
6. WHEN the VM is replaced or rebuilt, THEN the block volume SHALL be detachable and reattachable to a new instance without data loss.

---

### Requirement 5: OCI Container Image Registry (OCIR)

**User Story:** As a CI/CD pipeline, I want to push versioned Docker images to OCIR so the VM can pull and run exact image versions.

#### Acceptance Criteria

1. WHEN OCIR repositories are created, THEN two repositories SHALL exist: `jemeka/api` and `jemeka/web` under the tenancy's home region registry.
2. WHEN images are pushed, THEN they SHALL be tagged with both the Git commit SHA (e.g., `sha-abc1234`) and `latest`.
3. WHEN the VM pulls images, THEN it SHALL authenticate to OCIR using an OCI auth token stored as a Docker credential (via `docker login <region>.ocir.io`).
4. WHEN old images accumulate, THEN a lifecycle policy SHALL retain the last 5 tags per repository and delete older ones automatically.
5. WHEN the CI pipeline pushes an image, THEN the push SHALL fail loudly if OCIR credentials are missing or the repository does not exist.

---

### Requirement 6: Cloudflare DNS & Proxy Configuration

**User Story:** As an operator, I want all traffic to `jemekatours.com` and subdomains routed through Cloudflare so that TLS, DDoS protection, and CDN caching are applied automatically.

#### Acceptance Criteria

1. WHEN the domain is added to Cloudflare, THEN the nameservers at the registrar SHALL be updated to Cloudflare's assigned NS records.
2. WHEN DNS records are created, THEN an `A` record for `@` (apex) SHALL point to the OCI VM's public IP with proxy enabled (orange cloud).
3. WHEN DNS records are created, THEN a `CNAME` record for `www` SHALL point to `@` with proxy enabled.
4. WHEN DNS records are created, THEN an `A` record for `api` SHALL point to the OCI VM's public IP with proxy enabled.
5. WHEN DNS records are created, THEN a `CNAME` record for `cms` SHALL point to `@` with proxy enabled (for future Strapi use).
6. WHEN Cloudflare SSL/TLS mode is set, THEN it SHALL be configured to `Full (strict)` — meaning Cloudflare validates the origin's certificate (issued by Caddy/Let's Encrypt on the VM).
7. WHEN `Always Use HTTPS` is enabled, THEN all HTTP requests SHALL be redirected to HTTPS at the Cloudflare edge.
8. WHEN `Minimum TLS Version` is set, THEN it SHALL be `TLS 1.2` at minimum, with `TLS 1.3` enabled.

---

### Requirement 7: Caddy Reverse Proxy on the VM

**User Story:** As an operator, I want Caddy running as a container on the VM to terminate TLS from Cloudflare (using an origin certificate) and route traffic to the `web` and `api` containers.

#### Acceptance Criteria

1. WHEN the `Caddyfile` is created, THEN it SHALL define two virtual hosts: `jemekatours.com` (and `www.jemekatours.com`) proxying to the `web` container on port `3000`, and `api.jemekatours.com` proxying to the `api` container on port `4000`.
2. WHEN Cloudflare Origin CA is used, THEN the Caddyfile SHALL reference the origin certificate and private key stored on the block volume at `/data/caddy/certs/`.
3. WHEN Caddy starts, THEN it SHALL bind port 80 (for HTTP→HTTPS redirect) and port 443 (for TLS) on the VM.
4. WHEN a request arrives at `api.jemekatours.com`, THEN Caddy SHALL add a `X-Real-IP` header before proxying to the `api` container so that rate-limiting by IP works correctly.
5. WHEN a container is redeployed and briefly unavailable, THEN Caddy SHALL return `502 Bad Gateway` rather than hanging; upstream health checks in Caddy SHALL be configured with a 5-second timeout.

---

### Requirement 8: Environment Secrets Management

**User Story:** As an operator, I want all production secrets stored in OCI Vault and injected into containers at startup, so that no secrets are committed to git or baked into images.

#### Acceptance Criteria

1. WHEN OCI Vault is configured, THEN a vault named `jemeka-secrets` SHALL be created in the `jemeka-prod` compartment using the Free Tier (Virtual Private Vault, up to 20 secrets).
2. WHEN secrets are stored, THEN the following SHALL be individual secret entries: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_RESEND_KEY`, `PAYSTACK_SECRET_KEY`, `FRONTEND_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`.
3. WHEN the VM cloud-init script runs, THEN it SHALL use the OCI CLI with Instance Principal auth to fetch secrets from Vault and write them to `/data/secrets/.env` (readable only by the `deploy` user).
4. WHEN `docker compose up` is run, THEN it SHALL reference `/data/secrets/.env` via the `env_file` directive so containers receive secrets at startup.
5. WHEN a secret is rotated in OCI Vault, THEN running `docker compose pull && docker compose up -d` on the VM SHALL pick up the new value on next container start.
6. WHEN the `.env` file on the VM is written, THEN its permissions SHALL be `600` (owner read/write only).

---

### Requirement 9: CI/CD Deployment Pipeline

**User Story:** As a developer, I want every push to `main` to automatically build, push, and deploy updated images to the OCI VM, so that deployments are fully automated.

#### Acceptance Criteria

1. WHEN `.github/workflows/deploy.yml` is created, THEN it SHALL trigger on pushes to the `main` branch only (not on pull requests).
2. WHEN the pipeline runs, THEN it SHALL execute in order: (a) run all tests and type checks, (b) build Docker images for `api` and `web`, (c) push images to OCIR, (d) SSH into the OCI VM and run `docker compose pull && docker compose up -d --remove-orphans`.
3. WHEN Docker images are built in CI, THEN they SHALL be built for `linux/arm64` architecture to match the Ampere A1 VM.
4. WHEN OCIR credentials are needed in CI, THEN they SHALL be stored as GitHub Actions secrets: `OCI_REGISTRY`, `OCI_USERNAME`, `OCI_AUTH_TOKEN`, `OCI_TENANCY_NAMESPACE`.
5. WHEN the SSH step runs, THEN it SHALL use a private key stored as the GitHub secret `OCI_VM_SSH_KEY` to connect to the VM's `deploy` user.
6. WHEN a deployment fails (image build error, push failure, SSH error), THEN the workflow SHALL exit with a non-zero code and the PR/commit SHALL be marked failed in GitHub.
7. WHEN the pipeline completes successfully, THEN it SHALL post a deployment summary comment to the commit with the deployed image SHA and timestamp.
8. WHEN the `deploy` workflow runs, THEN it SHALL call the existing `ci.yml` quality checks as a prerequisite job (using `needs:`) so deployment is blocked if tests fail.

---

### Requirement 10: Application Health Validation Post-Deploy

**User Story:** As an operator, I want an automated post-deployment health check so that a broken deployment is detected immediately and can be rolled back.

#### Acceptance Criteria

1. WHEN the deploy pipeline's SSH step completes, THEN it SHALL wait up to 60 seconds for `GET https://api.jemekatours.com/health` to return HTTP 200 with `{ "ok": true, "db": "connected" }`.
2. WHEN the health check fails after 60 seconds, THEN the pipeline SHALL SSH back to the VM and run `docker compose up -d --scale api=0` then `docker compose up -d` to restart containers, and retry the health check once more.
3. WHEN the web app health check runs, THEN it SHALL verify `GET https://jemekatours.com/` returns HTTP 200.
4. WHEN both health checks pass, THEN the deploy pipeline SHALL record the deployment as successful.
5. WHEN any health check fails permanently (after retry), THEN the pipeline SHALL alert via a GitHub Actions summary with the curl output and container logs (`docker compose logs --tail=50`).

---

### Requirement 11: OCI Object Storage for Static Assets

**User Story:** As an operator, I want large static assets (tour images, documents) stored in OCI Object Storage and served via Cloudflare R2 or direct URL so that the VM disk is not used for media files.

#### Acceptance Criteria

1. WHEN an OCI Object Storage bucket is created, THEN it SHALL be named `jemeka-assets` in the `jemeka-prod` compartment with public read access for image objects.
2. WHEN the bucket is configured, THEN a Cloudflare CNAME record `assets.jemekatours.com` SHALL point to the bucket's public endpoint URL.
3. WHEN `next.config.ts` is updated, THEN `images.remotePatterns` SHALL include the `assets.jemekatours.com` hostname.
4. WHEN seed images or placeholder images are referenced in the app, THEN they SHALL be uploaded to the `jemeka-assets` bucket and their URLs updated in the seed data or environment config.
5. WHEN the Free Tier 10 GB object storage limit is approached (>8 GB used), THEN a Cloudflare R2 bucket SHALL be provisioned as overflow storage (10 GB free on R2).

---

### Requirement 12: Monitoring & Alerting

**User Story:** As an operator, I want basic monitoring so that downtime, high error rates, or resource exhaustion are detected and alerted on.

#### Acceptance Criteria

1. WHEN OCI Cloud Monitoring is configured, THEN an alarm SHALL trigger if CPU utilisation on the VM exceeds 85% for more than 5 minutes, sending a notification to the operator's email via OCI Notifications.
2. WHEN OCI Cloud Monitoring is configured, THEN an alarm SHALL trigger if available memory drops below 1 GB for more than 5 minutes.
3. WHEN Cloudflare Analytics is reviewed, THEN the operator SHALL be able to see request counts, cache hit ratios, and top error codes from the Cloudflare dashboard without additional configuration.
4. WHEN Uptime monitoring is set up, THEN at minimum one free external monitor (e.g., UptimeRobot free tier) SHALL ping `https://jemekatours.com/` every 5 minutes and email-alert on downtime.
5. WHEN container logs are needed, THEN `docker compose logs --follow` on the VM SHALL be the primary log access mechanism; logs SHALL be retained for at least 7 days via Docker's `json-file` driver with `max-size: "10m"` and `max-file: "5"`.

---

### Requirement 13: Deployment Playbook Documentation

**User Story:** As a developer (or future team member), I want a written step-by-step playbook so that deploying a new application to the same OCI + Cloudflare account requires no tribal knowledge.

#### Acceptance Criteria

1. WHEN `docs/DEPLOYMENT.md` is created, THEN it SHALL cover: prerequisites, OCI account setup, compartment creation, VCN provisioning, VM provisioning, OCIR setup, Cloudflare zone setup, DNS configuration, Vault secrets population, first deployment run, and smoke testing.
2. WHEN the playbook covers future app deployment, THEN it SHALL have a dedicated "Deploy a new application" section that references the shared VCN, NSG, and OCIR, and only requires provisioning compute resources in a new compartment.
3. WHEN the playbook covers secret rotation, THEN it SHALL document the exact commands to update a secret in OCI Vault and redeploy containers to pick up the change.
4. WHEN the playbook is complete, THEN a developer with no prior OCI experience SHALL be able to follow it end-to-end and reach a working deployment.
5. WHEN environment variable requirements change, THEN `.env.example` files in `apps/api` and `apps/web` SHALL be kept in sync with the `DEPLOYMENT.md` secret table.

---

### Requirement 14: Scalability & Future-App Readiness

**User Story:** As an operator, I want the infrastructure design to support deploying future applications without reconfiguring shared networking or Cloudflare settings.

#### Acceptance Criteria

1. WHEN a second application is deployed, THEN it SHALL be placed in a new OCI compartment and its containers run on the same VM (or a second VM in the same VCN) without modifying `jemeka-prod/network` resources.
2. WHEN a second application needs a subdomain, THEN adding an `A` record in the existing Cloudflare zone SHALL be sufficient — no new zone or account is needed.
3. WHEN `docker-compose.yml` is extended for a second app, THEN the `caddy` service SHALL be updated to add a new virtual host block; the existing `api` and `web` services SHALL remain unchanged.
4. WHEN OCI Free Tier OCPU and RAM limits are approached (>3.5 OCPUs or >20 GB RAM), THEN the playbook SHALL document the process for migrating to a paid shape without downtime.
5. WHEN the block volume reaches 80% capacity, THEN the playbook SHALL document how to extend the volume online via OCI's block volume resize feature.
