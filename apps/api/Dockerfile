FROM node:20-alpine AS builder

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies
RUN npm ci

# Build the API workspace
RUN npm run build --workspace=apps/api

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install sqlite native dependencies if necessary for libSQL
# RUN apk add --no-cache sqlite

# Copy the entire monorepo with node_modules (API needs the workspace symlinks)
# Since the API doesn't use standalone tracing natively like Next.js, we copy the built workspace.
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api

# Create directory for persistent SQLite database
RUN mkdir -p /data/db
# We don't change ownership if we run as root, but it's safer to run as node
RUN chown -R node:node /data/db

USER node

EXPOSE 4000

ENV PORT=4000
# Database will be mounted to /data/db/sqlite.db
ENV DB_FILE="file:/data/db/sqlite.db"

CMD ["npm", "run", "start", "--workspace=apps/api"]
