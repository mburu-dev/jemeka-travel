# Design: OCI + Cloudflare Deployment

## Overview

This document describes the architecture, component design, file-level changes, and implementation decisions for deploying the Jemeka Tours monorepo to OCI Free Tier compute with Cloudflare as the edge layer.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│  Internet                                                           │
└─────────────────────┬───────────────────────────────────────────────┘
                      │ HTTPS
            ┌─────────▼──────────┐
            │  Cloudflare Edge   │  DNS + TLS termination (Universal SSL)
            │  jemekatours.com   │  DDoS protection, WAF, CDN cache
            │  api.jemekatours   │  Brotli compression
            └─────────┬──────────┘
                      │ HTTPS (Full strict — Cloudflare Origin Cert)
                      │ Cloudflare IP ranges only (NSG rule)
            ┌─────────▼──────────────────────────────────────────────┐
            │  OCI VCN: 10.0.0.0/16                                  │
            │  Public Subnet: 10.0.1.0/24                            │
            │  ┌──────────────────────────────────────────────────┐  │
            │  │  VM.Standard.A1.Flex (2 OCPU, 12 GB RAM, ARM64)  │  │
            │  │  Ubuntu 22.04 LTS                                 │  │
            │  │                                                   │  │
            │  │  docker compose stack:                            │  │
            │  │  ┌────────┐  ┌────────┐  ┌────────────────────┐  │  │
            │  │  │ caddy  │  │  web   │  │       api          │  │  │
            │  │  │ :80    │  │ :3000  │  │      :4000         │  │  │
            │  │  │ :443   │  │ Next.js│  │  Hono + tRPC       │  │  │
            │  │  └───┬────┘  └────────┘  └────────────────────┘  │  │
            │  │      │ reverse proxy                              │  │
            │  │      └──────► web:3000 / api:4000                │  │
            │  │                                                   │  │
            │  │  Block Volume /data (50 GB):                      │  │
            │  │    /data/caddy/certs/   — Origin CA cert          │  │
            │  │    /data/secrets/.env   — secrets from Vault      │  │
            │  │    /data/logs/          — container log archive   │  │
            │  └──────────────────────────────────────────────────┘  │
            │  Private Subnet: 10.0.2.0/24 (reserved)               │
            └────────────────────────────────────────────────────────┘
                      │
            ┌─────────▼──────────┐
            │  Turso (libSQL)    │  Remote SQLite — jemeka production DB
            │  (external SaaS)   │  Authenticated via DATABASE_AUTH_TOKEN
            └────────────────────┘
```

---

## OCI Compartment Structure

```
Tenancy root
└── jemeka-prod  (compartment)
    ├── network   (compartment) — VCN, subnets, IGW, NSG
    ├── compute   (compartment) — VM instance, block volume
    ├── registry  (compartment) — OCIR repositories
    └── secrets   (compartment) — OCI Vault
```

Future apps add `jemeka-prod/app2`, `jemeka-prod/app3`, etc. The `network` compartment is shared read-only.

---

## File Changes

### New Files

| File | Purpose |
|---|---|
| `apps/api/Dockerfile` | Multi-stage Docker build for the Hono API |
| `apps/web/Dockerfile` | Multi-stage Docker build for the Next.js web app |
| `apps/api/.dockerignore` | Excludes `node_modules`, `dist`, `.env*`, `*.db` |
| `apps/web/.dockerignore` | Excludes `node_modules`, `.next/cache`, `.env*`, `*.db` |
| `docker-compose.yml` | Root-level Compose file: `caddy`, `web`, `api` services |
| `Caddyfile` | Caddy reverse-proxy config with two virtual hosts |
| `scripts/fetch-secrets.sh` | Shell script (runs on VM) to pull secrets from OCI Vault to `/data/secrets/.env` |
| `scripts/deploy.sh` | Shell script (runs on VM via SSH) to pull images and restart containers |
| `.github/workflows/deploy.yml` | GitHub Actions deployment workflow |
| `docs/DEPLOYMENT.md` | Full operator playbook |
| `infra/oci-setup.md` | Step-by-step OCI CLI commands for VCN, VM, OCIR, Vault setup |
| `infra/cloudflare-setup.md` | Step-by-step Cloudflare DNS and SSL configuration |

### Modified Files

| File | Change |
|---|---|
| `apps/web/next.config.ts` | Add `output: "standalone"`, add `images.remotePatterns` for `assets.jemekatours.com` |
| `.github/workflows/ci.yml` | Minor update: ensure it can be called as a reusable workflow by `deploy.yml` |
| `apps/api/.env.example` | Add `DATABASE_AUTH_TOKEN` and any missing production vars |
| `apps/web/.env.example` | Add `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` for production values |

---

## Docker Image Design

### API Dockerfile (`apps/api/Dockerfile`)

```dockerfile
# Stage 1 — builder
FROM node:22-alpine AS builder
WORKDIR /app
# Copy workspace root for package resolution
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/ ./packages/
RUN npm ci --workspace=apps/api --workspace=packages/db --workspace=packages/contracts
COPY apps/api ./apps/api
COPY packages ./packages
RUN npm run build --workspace=apps/api

# Stage 2 — runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

### Web Dockerfile (`apps/web/Dockerfile`)

```dockerfile
# Stage 1 — deps
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/ ./packages/
RUN npm ci --workspace=apps/web

# Stage 2 — builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace=apps/web

# Stage 3 — runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

---

## Docker Compose Design (`docker-compose.yml`)

```yaml
version: "3.9"
services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - /data/caddy:/data
      - /data/caddy/certs:/certs:ro
    depends_on:
      - web
      - api

  web:
    image: ${OCI_REGISTRY}/jemeka/web:${IMAGE_TAG:-latest}
    restart: unless-stopped
    env_file: /data/secrets/.env
    expose:
      - "3000"
    depends_on:
      - api

  api:
    image: ${OCI_REGISTRY}/jemeka/api:${IMAGE_TAG:-latest}
    restart: unless-stopped
    env_file: /data/secrets/.env
    expose:
      - "4000"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "5"
```

---

## Caddyfile Design

```caddyfile
{
  # Global options
  email admin@jemekatours.com
}

jemekatours.com, www.jemekatours.com {
  tls /certs/origin.pem /certs/origin.key
  reverse_proxy web:3000 {
    header_up X-Real-IP {remote_host}
    transport http {
      dial_timeout 5s
    }
  }
}

api.jemekatours.com {
  tls /certs/origin.pem /certs/origin.key
  reverse_proxy api:4000 {
    header_up X-Real-IP {remote_host}
    transport http {
      dial_timeout 5s
    }
  }
}
```

**Note:** The TLS certificates referenced here are Cloudflare Origin CA certificates (15-year validity, issued free from Cloudflare dashboard), not Let's Encrypt. This works because Cloudflare terminates public TLS and only talks to the origin over the Cloudflare network.

---

## OCI Vault Secret Fetch Script (`scripts/fetch-secrets.sh`)

```bash
#!/bin/bash
# Requires OCI CLI configured with Instance Principal auth
set -euo pipefail

VAULT_ID="ocid1.vault.oc1...."  # populated during setup
OUTPUT_FILE="/data/secrets/.env"

mkdir -p /data/secrets
chmod 700 /data/secrets

declare -A SECRETS=(
  ["DATABASE_URL"]="ocid1.vaultsecret.oc1...."
  ["DATABASE_AUTH_TOKEN"]="ocid1.vaultsecret.oc1...."
  # ... other secrets
)

truncate -s 0 "$OUTPUT_FILE"
for KEY in "${!SECRETS[@]}"; do
  VALUE=$(oci secrets secret-bundle get \
    --secret-id "${SECRETS[$KEY]}" \
    --query 'data."secret-bundle-content".content' \
    --raw-output | base64 -d)
  echo "${KEY}=${VALUE}" >> "$OUTPUT_FILE"
done

chmod 600 "$OUTPUT_FILE"
echo "Secrets written to $OUTPUT_FILE"
```

---

## GitHub Actions Deploy Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  quality:
    uses: ./.github/workflows/ci.yml   # reuse existing CI checks

  deploy:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set image tag
        run: echo "IMAGE_TAG=sha-$(git rev-parse --short HEAD)" >> $GITHUB_ENV

      - name: Log in to OCIR
        run: |
          echo "${{ secrets.OCI_AUTH_TOKEN }}" | docker login \
            ${{ secrets.OCI_REGISTRY }} \
            -u "${{ secrets.OCI_TENANCY_NAMESPACE }}/${{ secrets.OCI_USERNAME }}" \
            --password-stdin

      - name: Build and push API image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/api/Dockerfile
          platforms: linux/arm64
          push: true
          tags: |
            ${{ secrets.OCI_REGISTRY }}/jemeka/api:${{ env.IMAGE_TAG }}
            ${{ secrets.OCI_REGISTRY }}/jemeka/api:latest

      - name: Build and push Web image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/web/Dockerfile
          platforms: linux/arm64
          push: true
          tags: |
            ${{ secrets.OCI_REGISTRY }}/jemeka/web:${{ env.IMAGE_TAG }}
            ${{ secrets.OCI_REGISTRY }}/jemeka/web:latest

      - name: Deploy to OCI VM
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.OCI_VM_HOST }}
          username: deploy
          key: ${{ secrets.OCI_VM_SSH_KEY }}
          script: |
            export OCI_REGISTRY=${{ secrets.OCI_REGISTRY }}
            export IMAGE_TAG=${{ env.IMAGE_TAG }}
            /home/deploy/scripts/deploy.sh

      - name: Health check
        run: |
          for i in $(seq 1 12); do
            STATUS=$(curl -sf https://api.jemekatours.com/health | jq -r '.ok' 2>/dev/null || echo "false")
            if [ "$STATUS" = "true" ]; then
              echo "Health check passed"
              exit 0
            fi
            echo "Attempt $i failed, retrying in 5s..."
            sleep 5
          done
          echo "Health check failed after 60s"
          exit 1
```

---

## VM Cloud-Init Script

```yaml
#cloud-config
package_update: true
package_upgrade: true

packages:
  - apt-transport-https
  - ca-certificates
  - curl
  - gnupg
  - lsb-release

runcmd:
  # Install Docker
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  - echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
  - apt-get update
  - apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

  # Install OCI CLI
  - bash -c "$(curl -fsSL https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)" -- --accept-all-defaults

  # Create deploy user
  - useradd -m -s /bin/bash deploy
  - usermod -aG docker deploy
  - echo "deploy ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/local/bin/docker" >> /etc/sudoers.d/deploy

  # Mount block volume
  - mkfs.xfs /dev/sdb
  - mkdir -p /data
  - echo "/dev/sdb /data xfs defaults,nofail 0 2" >> /etc/fstab
  - mount -a
  - mkdir -p /data/caddy/certs /data/secrets /data/logs
  - chown -R deploy:deploy /data

  # Copy scripts
  - mkdir -p /home/deploy/scripts
  - chown deploy:deploy /home/deploy/scripts
```

---

## Cloudflare Configuration Steps

### SSL/TLS Settings
- SSL/TLS mode: **Full (strict)**
- Always Use HTTPS: **On**
- Minimum TLS Version: **TLS 1.2**
- TLS 1.3: **On**
- Automatic HTTPS Rewrites: **On**

### Origin Certificate
Generate a 15-year Cloudflare Origin CA certificate from the Cloudflare dashboard (SSL/TLS → Origin Server → Create Certificate). Download `origin.pem` and `origin.key`, upload to `/data/caddy/certs/` on the VM.

### DNS Records
| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `<VM public IP>` | Proxied |
| CNAME | `www` | `jemekatours.com` | Proxied |
| A | `api` | `<VM public IP>` | Proxied |
| CNAME | `assets` | `<OCI bucket endpoint>` | Proxied |
| CNAME | `cms` | `jemekatours.com` | Proxied (future) |

### Page Rules (Free Tier: 3 rules)
1. `jemekatours.com/api/trpc/*` — Cache Level: Bypass (API must never be cached at edge)
2. `jemekatours.com/_next/static/*` — Cache Level: Cache Everything, Edge TTL: 1 month
3. `jemekatours.com/images/*` — Cache Level: Cache Everything, Edge TTL: 1 week

---

## NSG Rules (OCI)

| Direction | Protocol | Source | Port | Purpose |
|---|---|---|---|---|
| Inbound | TCP | `0.0.0.0/0` | 80 | HTTP (Caddy redirects to HTTPS) |
| Inbound | TCP | Cloudflare IPs | 443 | HTTPS via Cloudflare proxy |
| Inbound | TCP | Operator IP | 22 | SSH management |
| Outbound | All | `0.0.0.0/0` | All | Internet egress (OCIR pull, Turso, etc.) |

---

## GitHub Actions Secrets Required

| Secret Name | Value |
|---|---|
| `OCI_REGISTRY` | `<region-code>.ocir.io` |
| `OCI_TENANCY_NAMESPACE` | Found in OCI Console → Tenancy Details |
| `OCI_USERNAME` | OCI user email |
| `OCI_AUTH_TOKEN` | Generated in OCI Console → User Settings → Auth Tokens |
| `OCI_VM_HOST` | VM's public IP address |
| `OCI_VM_SSH_KEY` | Contents of the SSH private key for `deploy` user |

---

## Correctness Properties

### Property 1: No secrets in git or images
All secrets are injected at runtime from OCI Vault via `/data/secrets/.env`. Docker images contain no `.env` files and no hardcoded credentials. Verified by scanning image layers with `docker history --no-trunc`.

### Property 2: Origin IP is not publicly resolvable
With Cloudflare proxy enabled and NSG restricting port 443 to Cloudflare IP ranges only, a direct DNS lookup of `jemekatours.com` returns a Cloudflare anycast IP, not the OCI VM IP. The VM IP is only accessible via Cloudflare.

### Property 3: Deployment is idempotent
Running `docker compose pull && docker compose up -d --remove-orphans` is safe to run multiple times. Containers are only restarted if their image has changed. The `--remove-orphans` flag removes containers for services removed from the compose file.

### Property 4: Health check gates go-live
The deploy pipeline does not mark a deployment successful until `GET /health` returns `{ ok: true, db: "connected" }`. A deployment that breaks the database connection is detected before traffic is served.

---

## Error Handling

- **Image build failure**: CI exits non-zero; deploy step is skipped; commit is marked failed.
- **OCIR push failure**: CI exits non-zero; VM never receives the SSH deploy command.
- **SSH failure**: `appleboy/ssh-action` exits non-zero; workflow fails; existing containers continue running (no downtime).
- **Health check failure**: Pipeline posts logs to GitHub Actions summary; operator is notified via GitHub email.
- **Secret missing from Vault**: `fetch-secrets.sh` exits non-zero due to `set -euo pipefail`; `/data/secrets/.env` is not written; containers fail to start with a clear error; operator is alerted via OCI Monitoring.
- **Caddy TLS cert missing**: Caddy exits at startup; `docker compose ps` shows `caddy` as unhealthy; health check fails immediately.

---

## Scalability Notes

The VM has 2 OCPU and 12 GB RAM — roughly 25% of the Free Tier allocation. Adding a second app requires:
1. New compartment in OCI.
2. New OCIR repositories for the app's images.
3. New secrets in the same OCI Vault.
4. New services in `docker-compose.yml`.
5. New virtual host block in `Caddyfile`.
6. New DNS records in Cloudflare.

The remaining 2 OCPU and 12 GB RAM are available for the second app, or a second `VM.Standard.A1.Flex` (2 OCPU, 12 GB) can be provisioned within the free allocation.
