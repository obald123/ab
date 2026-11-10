# syntax=docker/dockerfile:1.7

# ─────────────────────────────────────────────────────────────────────────────
# AB BANK PLC — public website image
#
# Stage 1 builds the static site with Node; stage 2 serves it with nginx. The
# runtime has no Node, no source and no secrets — only HTML, JS, CSS and images.
#
# The same image runs on any domain: the API is reached on the same origin
# (nginx forwards /api to the backend), and the domain-specific parts —
# backend address, CMS origin for previews — are environment variables read
# when the container starts. See docker/default.conf.template.
#
# Runs unprivileged (uid 101, port 8080) and works under an arbitrary uid, so
# it is accepted as-is by Docker, Podman, Kubernetes and OpenShift.
# ─────────────────────────────────────────────────────────────────────────────

ARG NODE_VERSION=22.21.0

FROM node:${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json* ./
# Exact versions when a lockfile is committed; a fresh resolve otherwise.
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci --fetch-retries=5; else npm install --fetch-retries=5; fi

COPY . .

# Empty = call the API on this site's own origin (/api), which nginx forwards.
ARG VITE_API_URL=""
# Public chatbot widget id; not a secret (it ships to every browser anyway).
ARG VITE_PROTO_CHATBOT_ID=""
ENV VITE_API_URL=${VITE_API_URL} \
    VITE_PROTO_CHATBOT_ID=${VITE_PROTO_CHATBOT_ID}
RUN npm run build

# ─── Runtime ─────────────────────────────────────────────────────────────────
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

# Defaults suit docker compose; override per environment.
ENV API_UPSTREAM=http://api:4000 \
    CMS_ORIGIN=https://admin.example.com \
    SERVER_NAME=_

COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/security-headers.inc.template /etc/nginx/templates/security-headers.inc.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
