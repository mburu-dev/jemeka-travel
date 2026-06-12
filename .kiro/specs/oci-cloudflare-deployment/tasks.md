# Implementation Plan: OCI + Cloudflare Deployment

## Overview

This plan covers 28 tasks across 6 phases: Codebase preparation, Docker packaging, OCI infrastructure, Cloudflare configuration, CI/CD pipeline, and post-deploy validation + documentation. Tasks in the same wave are independent and can be executed in parallel.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["D01", "D02", "D03"] },
    { "wave": 2, "tasks": ["D04", "D05", "D06"] },
    { "wave": 3, "tasks": ["D07", "D08", "D09", "D10"] },
    { "wave": 4, "tasks": ["D11", "D12", "D13", "D14"] },
    { "wave": 5, "tasks": ["D15", "D16", "D17", "D18", "D19"] },
    { "wave": 6, "tasks": ["D20", "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28"] }
  ]
}
```

---

## Phase 1 — Codebase Preparation

### D01 · Enable Next.js standalone output
- [~] Open `apps/web/next.config.ts`
- [~] Add `output: "standalone"` to the `nextConfig` object
- [~] Run `npm run build --workspace=apps/web` locally and verify `.next/standalone/` directory is created
- [~] Verify `apps/web/.next/standalone/apps/web/server.js` exists (the standalone entry point)
- [~] Confirm `.next/standalone` contains a self-contained node app without a full `node_modules`

### D02 · Add production environment variable documentation
- [~] Open `apps/api/.env.example`
- [~] Add `DATABASE_AUTH_TOKEN=` (Turso auth token for production)
- [~] Add `FRONTEND_URL=https://jemekatours.com` as a comment showing production value
- [~] Open `apps/web/.env.example`
- [~] Add `NEXTAUTH_URL=https://jemekatours.com`
- [~] Add `NEXT_PUBLIC_APP_URL=https://jemekatours.com`
- [~] Add `NEXT_PUBLIC_API_URL=https://api.jemekatours.com/api/trpc`
- [~] Review both `.env.example` files against the secrets list in `design.md` and confirm all production vars are documented

### D03 · Configure Next.js image remote patterns for production CDN
- [ ] Open `apps/web/next.config.ts`
- [~] Add `images: { remotePatterns: [{ protocol: "https", hostname: "assets.jemekatours.com" }, { protocol: "https", hostname: "**.ocir.io" }] }` to `nextConfig`
- [~] Verify `npm run build --workspace=apps/web` still passes after this change

---

## Phase 2 — Docker Packaging

### D04 · Create API Dockerfile
- [~] Create `apps/api/Dockerfile` using the multi-stage build from `design.md`
- [~] Stage 1 (`builder`): use `node:22-alpine`, copy workspace package files, run `npm ci` for production deps, copy source, run `npm run build --workspace=apps/api`
- [~] Stage 2 (`runner`): copy only `dist/` and production `node_modules` from builder
- [~] Set `ENV NODE_ENV=production`, `EXPOSE 4000`, `CMD ["node", "dist/index.js"]`
- [~] Create `apps/api/.dockerignore` excluding: `node_modules`, `dist`, `.env*`, `*.db`, `coverage`, `.nyc_output`
- [~] Run `docker build -t jemeka/api:test -f apps/api/Dockerfile .` from the repo root and verify it builds without errors
- [~] Run `docker run --rm -e DATABASE_URL=file:/dev/null jemeka/api:test` and verify the process starts (may fail on DB connect, but should not crash on module import)

### D05 · Create Web Dockerfile
- [~] Create `apps/web/Dockerfile` using the three-stage build from `design.md` (deps → builder → runner)
- [~] Stage 1 (`deps`): install all web app dependencies
- [~] Stage 2 (`builder`): copy deps, copy source, set `NEXT_TELEMETRY_DISABLED=1`, run `npm run build --workspace=apps/web`
- [~] Stage 3 (`runner`): use `node:22-alpine`, create `nextjs` system user (UID 1001), copy `.next/standalone`, `.next/static`, and `public/` from builder
- [~] Set `USER nextjs`, `EXPOSE 3000`, `CMD ["node", "apps/web/server.js"]`
- [~] Create `apps/web/.dockerignore` excluding: `node_modules`, `.next/cache`, `.env*`, `*.db`, `playwright-report`, `test-results`
- [~] Run `docker build -t jemeka/web:test -f apps/web/Dockerfile .` from the repo root and verify it builds
- [~] Verify the resulting image is under 500 MB with `docker images jemeka/web:test`

### D06 · Create docker-compose.yml and Caddyfile
- [~] Create `docker-compose.yml` at the repo root with `caddy`, `web`, and `api` services as defined in `design.md`
- [~] Use `env_file: /data/secrets/.env` for both `web` and `api` services
- [~] Configure Docker logging on both services: `driver: json-file`, `max-size: 10m`, `max-file: 5`
- [~] Add `restart: unless-stopped` to all services
- [~] Create `Caddyfile` at repo root with virtual hosts for `jemekatours.com` and `api.jemekatours.com` as defined in `design.md`
- [~] Reference TLS certs at `/certs/origin.pem` and `/certs/origin.key` (mapped from `/data/caddy/certs/` on the VM)
- [~] Test compose file syntax locally: `docker compose config` should parse without errors

---

## Phase 3 — OCI Infrastructure Setup

### D07 · OCI compartment and IAM setup (manual step — documented commands)
- [~] Create `infra/oci-setup.md` with the following OCI CLI commands documented:
  - Create compartment `jemeka-prod` under tenancy root
  - Create child compartments: `network`, `compute`, `registry`, `secrets`
  - Create IAM group `jemeka-deployers`
  - Create IAM policy allowing `jemeka-deployers` to manage instances in `compute`, repositories in `registry`, and secrets in `secrets` compartments
  - Create OCI auth token for CI pipeline user
- [~] Document how to find the tenancy namespace (needed for OCIR image paths)
- [~] Document how to configure OCI CLI locally: `oci setup config`

### D08 · OCI VCN and networking (manual step — documented commands)
- [~] Add VCN creation commands to `infra/oci-setup.md`:
  - Create VCN `jemeka-vcn` with CIDR `10.0.0.0/16` in `jemeka-prod/network`
  - Create Internet Gateway `jemeka-igw` and attach to VCN
  - Create public subnet `10.0.1.0/24` with the IGW route table
  - Create private subnet `10.0.2.0/24` (no IGW route)
  - Create NSG `jemeka-vm-nsg` with the inbound/outbound rules from `design.md`
  - Document the Cloudflare IP list URL for restricting port 443 ingress

### D09 · OCI compute instance provisioning (manual step — documented commands)
- [~] Add VM provisioning commands to `infra/oci-setup.md`:
  - Generate SSH key pair: `ssh-keygen -t ed25519 -f ~/.ssh/jemeka-oci -C "jemeka-deploy"`
  - Create VM instance: shape `VM.Standard.A1.Flex`, 2 OCPU, 12 GB RAM, Ubuntu 22.04 ARM64, in `jemeka-prod/compute`
  - Attach NSG `jemeka-vm-nsg` to instance
  - Assign public IP (ephemeral or reserved)
  - Document how to attach the 50 GB block volume and mount at `/data`
- [~] Create `scripts/cloud-init.yaml` with the full cloud-init script from `design.md`
- [~] Document that `cloud-init.yaml` is passed as user data during VM creation

### D10 · OCI Vault and secrets setup (manual step — documented commands)
- [~] Add Vault setup commands to `infra/oci-setup.md`:
  - Create Vault `jemeka-secrets` in `jemeka-prod/secrets`
  - Create master encryption key
  - Create individual secret entries for all vars listed in `design.md` (Requirement 8.2)
  - Document how to update a secret value: `oci vault secret update-base64 --secret-id ... --secret-content-content $(echo -n "new-value" | base64)`
- [~] Create `scripts/fetch-secrets.sh` from the template in `design.md`
- [~] Add the actual secret OCIDs as placeholders in `fetch-secrets.sh` (to be filled in after Vault creation)
- [~] Document how to enable Instance Principal auth so the VM can call OCI APIs without a config file
- [~] Document the IAM policy required: `Allow dynamic-group jemeka-vm-group to read secret-family in compartment jemeka-prod/secrets`

---

## Phase 4 — Cloudflare Configuration

### D11 · Cloudflare zone and DNS setup (manual step — documented)
- [~] Create `infra/cloudflare-setup.md`
- [~] Document: adding the domain to Cloudflare, updating registrar nameservers to Cloudflare's NS records
- [~] Document creating the DNS records from `design.md`: `A @`, `CNAME www`, `A api`, `CNAME assets`, `CNAME cms`
- [~] Note: the `A` records' IP address is the OCI VM's public IP (to be filled in after D09)
- [~] Document enabling proxy (orange cloud) on all records
- [~] Document verifying DNS propagation with `dig jemekatours.com NS`

### D12 · Cloudflare SSL/TLS configuration (manual step — documented)
- [~] Add to `infra/cloudflare-setup.md`:
  - Set SSL/TLS mode to `Full (strict)` (Cloudflare dashboard → SSL/TLS → Overview)
  - Enable `Always Use HTTPS` (SSL/TLS → Edge Certificates)
  - Set Minimum TLS Version to `TLS 1.2`
  - Enable TLS 1.3
  - Enable Automatic HTTPS Rewrites
- [~] Document how to generate a Cloudflare Origin CA certificate (SSL/TLS → Origin Server → Create Certificate, 15-year validity)
- [~] Document the `openssl` command to verify the origin cert: `openssl x509 -in origin.pem -text -noout`
- [~] Document uploading `origin.pem` and `origin.key` to the VM at `/data/caddy/certs/` via `scp`

### D13 · Cloudflare Page Rules and cache configuration (manual step — documented)
- [ ] Add to `infra/cloudflare-setup.md`:
  - Page Rule 1: `*jemekatours.com/api/trpc/*` → Cache Level: Bypass
  - Page Rule 2: `*jemekatours.com/_next/static/*` → Cache Level: Cache Everything, Edge TTL: 1 month
  - Page Rule 3: `*jemekatours.com/images/*` → Cache Level: Cache Everything, Edge TTL: 1 week
- [~] Document enabling Brotli compression: Speed → Optimization → Brotli → On
- [~] Document enabling HTTP/2 and HTTP/3 (QUIC): Network → HTTP/2 and HTTP/3

### D14 · OCI Container Image Registry (OCIR) setup (manual step — documented)
- [~] Add to `infra/oci-setup.md`:
  - Create OCIR repository `jemeka/api` in `jemeka-prod/registry` (visibility: private)
  - Create OCIR repository `jemeka/web` in `jemeka-prod/registry` (visibility: private)
  - Document the image naming convention: `<region>.ocir.io/<tenancy-namespace>/jemeka/api:<tag>`
  - Document how to authenticate Docker to OCIR: `docker login <region>.ocir.io -u <tenancy-namespace>/<username> -p <auth-token>`
  - Document adding the lifecycle policy to retain last 5 tags per repository
  - Document adding the OCIR login command to the VM's `~/.profile` for the `deploy` user

---

## Phase 5 — CI/CD Pipeline

### D15 · Create deploy script on VM
- [~] Create `scripts/deploy.sh` with:
  ```bash
  #!/bin/bash
  set -euo pipefail
  cd /home/deploy/compose
  docker compose pull
  docker compose up -d --remove-orphans
  echo "Deploy complete at $(date)"
  ```
- [~] Document in `infra/oci-setup.md`: copy `docker-compose.yml`, `Caddyfile`, and `scripts/` to `/home/deploy/compose/` on the VM during initial setup
- [~] Document: `chmod +x /home/deploy/scripts/deploy.sh` and `chmod +x /home/deploy/scripts/fetch-secrets.sh`
- [~] Document the one-time first-deploy command: `bash /home/deploy/scripts/fetch-secrets.sh && bash /home/deploy/scripts/deploy.sh`

### D16 · Update CI workflow to be callable as reusable workflow
- [~] Open `.github/workflows/ci.yml`
- [~] Add `workflow_call:` trigger under `on:` so the CI workflow can be called by `deploy.yml` using `uses:`
- [~] Ensure all CI jobs have proper `permissions:` blocks (read for contents, none for write)
- [~] Verify CI still runs standalone on pull requests by checking the existing `pull_request` trigger is preserved

### D17 · Create GitHub Actions deploy workflow
- [~] Create `.github/workflows/deploy.yml` using the template from `design.md`
- [~] Add `needs: quality` to the `deploy` job to block deployment if CI fails
- [~] Add `docker/setup-qemu-action@v3` and `docker/setup-buildx-action@v3` steps before the build steps (required for `linux/arm64` cross-compilation on `ubuntu-latest` runners)
- [~] Use `docker/build-push-action@v6` for both API and web image builds
- [~] Add the SSH deploy step using `appleboy/ssh-action@v1`
- [~] Add the health check step as described in Requirement 10
- [~] Add a final step that posts the IMAGE_TAG and deployment timestamp to the GitHub Actions job summary using `$GITHUB_STEP_SUMMARY`

### D18 · Configure GitHub Actions secrets
- [~] Create `docs/DEPLOYMENT.md` section: "GitHub Actions Secrets"
- [~] Document each secret from `design.md`'s GitHub Actions Secrets table with instructions on where to find each value
- [~] Document: Settings → Secrets and variables → Actions → New repository secret
- [~] List all 6 required secrets: `OCI_REGISTRY`, `OCI_TENANCY_NAMESPACE`, `OCI_USERNAME`, `OCI_AUTH_TOKEN`, `OCI_VM_HOST`, `OCI_VM_SSH_KEY`

### D19 · Set up UptimeRobot monitoring
- [~] Document in `docs/DEPLOYMENT.md`: creating a free UptimeRobot account
- [~] Document: Add monitor → HTTPS → `https://jemekatours.com/` → 5-minute check interval → email alerts
- [~] Document: Add a second monitor for `https://api.jemekatours.com/health`
- [~] Document: OCI Monitoring alarm creation for CPU > 85% and RAM < 1 GB via OCI Console → Observability → Monitoring → Alarms

---

## Phase 6 — First Deployment, Validation & Documentation

### D20 · Execute first deployment end-to-end
- [~] On the OCI VM (after D07–D10 complete): run `bash /home/deploy/scripts/fetch-secrets.sh`
- [~] Verify `/data/secrets/.env` contains all expected keys (no empty values)
- [~] Authenticate Docker to OCIR on the VM: `docker login <region>.ocir.io ...`
- [~] Manually push images from local machine for first deploy: `docker buildx build --platform linux/arm64 --push -t <region>.ocir.io/<ns>/jemeka/api:first .`
- [~] On VM: run `cd /home/deploy/compose && docker compose up -d`
- [~] Verify all containers are running: `docker compose ps`
- [~] Verify Caddy logs show no TLS errors: `docker compose logs caddy`

### D21 · Smoke test the live deployment
- [~] Test: `curl -I https://jemekatours.com/` returns HTTP 200
- [~] Test: `curl -I https://api.jemekatours.com/health` returns HTTP 200 with `{"ok":true,"db":"connected",...}`
- [~] Test: Open `https://jemekatours.com/` in a browser, verify the home page renders with images
- [~] Test: Open `https://jemekatours.com/destinations` and verify destination cards load
- [~] Test: Verify SSL certificate is valid: browser padlock shows Cloudflare Universal SSL cert
- [~] Test: Verify `https://www.jemekatours.com/` redirects correctly to apex domain
- [~] Test: Verify `curl -I http://jemekatours.com/` returns a 301 redirect to HTTPS
- [~] Test: Open Chrome DevTools → Network, verify `_next/static/` assets are served with `CF-Cache-Status: HIT` on second load
- [~] Document any issues found and their resolutions in `docs/DEPLOYMENT.md`

### D22 · Verify OCI Free Tier resource usage
- [~] In OCI Console: navigate to Governance → Limits, Quotas and Usage
- [~] Verify OCPU usage is ≤ 4 total across all instances in the tenancy
- [~] Verify RAM usage is ≤ 24 GB
- [~] Verify block storage is ≤ 200 GB
- [~] Verify object storage is ≤ 10 GB
- [~] Screenshot or document current usage levels in `docs/DEPLOYMENT.md` as a baseline
- [~] Set up OCI Budget alert: Budgets → Create Budget → $0.01 alert threshold to catch any accidental billable resource creation

### D23 · Test deployment pipeline end-to-end
- [~] Create a trivial code change (e.g., update a comment in `apps/api/src/index.ts`)
- [~] Push to a feature branch and open a pull request — verify `ci.yml` runs and passes
- [~] Merge the PR to `main` — verify `deploy.yml` triggers
- [~] Watch the GitHub Actions run: confirm quality → build → push → SSH deploy → health check all pass
- [~] Verify the deployed version reflects the new commit: check `docker compose ps` on VM shows new image SHA
- [~] Verify the GitHub Actions summary shows the IMAGE_TAG and timestamp

### D24 · Test secret rotation workflow
- [~] Document the rotation workflow in `docs/DEPLOYMENT.md`
- [~] Perform a test rotation: update any non-critical secret in OCI Vault (e.g., add a test env var)
- [~] On the VM: run `fetch-secrets.sh` to refresh `/data/secrets/.env`
- [~] Run `docker compose up -d` to restart containers with new secrets
- [~] Verify the app still starts correctly and `/health` returns `ok: true`

### D25 · OCI Object Storage bucket setup
- [~] Create OCI Object Storage bucket `jemeka-assets` in `jemeka-prod` compartment with public read enabled
- [~] Note the bucket's public URL endpoint in `infra/oci-setup.md`
- [~] In Cloudflare DNS: create `CNAME assets.jemekatours.com` → OCI bucket endpoint with proxy enabled
- [~] Upload the placeholder images from `apps/web/public/images/` to the bucket
- [~] Verify `https://assets.jemekatours.com/<image-file>` is publicly accessible
- [~] Test: verify `next/image` with `src="https://assets.jemekatours.com/serengeti.jpg"` renders correctly in the deployed app

### D26 · Write complete DEPLOYMENT.md playbook
- [~] Create `docs/DEPLOYMENT.md` with all sections:
  - **Prerequisites** (OCI account, Cloudflare account, domain, OCI CLI, Docker, GitHub)
  - **Step 1: OCI Account Setup** (compartments, IAM, VCN, VM) — reference `infra/oci-setup.md`
  - **Step 2: Cloudflare Setup** (add domain, DNS, SSL) — reference `infra/cloudflare-setup.md`
  - **Step 3: OCI Vault** (create vault, populate secrets)
  - **Step 4: OCIR Setup** (create repos, auth token)
  - **Step 5: VM First Boot** (cloud-init, fetch-secrets, first docker compose up)
  - **Step 6: GitHub Secrets** (list all 6 secrets)
  - **Step 7: First Automated Deploy** (merge to main, watch pipeline)
  - **Step 8: Smoke Testing** (checklist from D21)
  - **Monitoring** (UptimeRobot, OCI alarms, Cloudflare Analytics)
  - **Secret Rotation** (OCI Vault update + redeploy steps)
  - **Deploying a Second Application** (new compartment, new OCIR repos, extend compose + Caddyfile, new DNS record)
  - **Free Tier Limit Tracking** (table of limits and current usage)
  - **Troubleshooting** (common issues: Caddy cert errors, OCIR auth failure, health check timeout)
- [~] Review the playbook: a developer with no OCI experience should be able to follow it end-to-end

### D27 · Configure OCI Monitoring alarms
- [~] In OCI Console: Observability & Management → Monitoring → Alarms → Create Alarm
- [~] Alarm 1: `oci_computeagent` → `CpuUtilization` > 85% for 5 minutes → notify via email
- [~] Alarm 2: `oci_computeagent` → `MemoryUtilization` > 85% for 5 minutes → notify via email
- [~] Create OCI Notification topic and subscription (email) for alarm delivery
- [~] Test alarm delivery by briefly spiking CPU (e.g., `stress --cpu 2 --timeout 360` on VM) — verify email arrives

### D28 · Scalability readiness check and future-app section
- [~] In `docs/DEPLOYMENT.md`: document "Deploying App #2" section covering:
  - Create `jemeka-prod/app2` compartment
  - Create OCIR repositories `jemeka/app2-api` and `jemeka/app2-web`
  - Add new services to `docker-compose.yml` on the same VM
  - Add new virtual host to `Caddyfile`
  - Add new DNS `A` record in Cloudflare
  - Add new secrets to OCI Vault
  - Trigger deploy pipeline
- [~] Calculate remaining Free Tier headroom after initial deployment and document it:
  - Remaining OCPU: 4 total − 2 used = **2 free**
  - Remaining RAM: 24 GB − 12 GB used = **12 GB free**
  - Remaining block storage: 200 GB − 50 GB used = **150 GB free**
- [~] Document the scale-up path: if a paid upgrade is needed, the recommended shape is `VM.Standard.A1.Flex` with 4 OCPU + 24 GB (still free) or `VM.Standard.E4.Flex` (paid) for single-instance scale-up

---

## Completion Checklist

Before marking this spec complete, verify:

- [~] `apps/web/.next/standalone/` is generated by `npm run build`
- [~] `docker build -f apps/api/Dockerfile .` completes without error
- [~] `docker build -f apps/web/Dockerfile .` completes without error
- [~] `docker compose config` parses without error
- [~] `https://jemekatours.com/` returns HTTP 200 in a browser
- [~] `https://api.jemekatours.com/health` returns `{"ok":true,"db":"connected"}`
- [~] SSL padlock is valid in browser
- [~] `http://jemekatours.com/` redirects to `https://`
- [~] `www.jemekatours.com` redirects correctly
- [~] A push to `main` triggers `deploy.yml` and succeeds end-to-end
- [~] No secrets are present in git history or Docker image layers
- [~] OCI resource usage is within Free Tier limits
- [~] UptimeRobot monitor is active for both endpoints
- [~] `docs/DEPLOYMENT.md` is complete and covers the "second app" scenario
- [~] `infra/oci-setup.md` and `infra/cloudflare-setup.md` are complete

## Notes

- Wave 1 (D01–D03) and Wave 2 (D04–D06) are pure codebase work — no cloud accounts needed.
- Wave 3 (D07–D10) and Wave 4 (D11–D14) are manual cloud setup steps, documented as commands. They depend on each other only loosely (Cloudflare DNS needs the VM IP from D09).
- D07–D14 produce `infra/oci-setup.md` and `infra/cloudflare-setup.md` as living documents. The subagent creates the doc files; the operator executes the commands against their cloud accounts.
- D20 (first deployment) depends on D07–D19 being complete.
- The codebase-hardening spec tasks (T01–T32) should be completed before D20 to ensure the deployed app is production-ready.
