# Get node image via internal Artifactory7 repo
FROM node:20-slim as builder

# Set timezone
RUN cp -r -f /usr/share/zoneinfo/Europe/Stockholm /etc/localtime


# Set node env and copy app source
ENV NODE_ENV=production
ADD . /app
WORKDIR /app

# If building your code for production use "ci" to get a consistent build with exact versions every time (from package-lock.json)
RUN npm ci --omit=dev

# Clean up
RUN rm -rf doc Dockerfile* .gitignore .git .vscode .env egress

# Use node user
USER node

# Multi stage build
FROM node:20-slim
USER node
COPY --from=builder /app /app
WORKDIR /app

# Entrypoint with OTEL tracing
CMD [ "node", "app.js" ]
# CMD [ "node", "-r", "./otel/tracing.js", "server.js" ]