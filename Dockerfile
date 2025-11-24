# Stage 1: Build TypeScript
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code and tsconfig
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Production runtime
FROM node:18-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy built JavaScript from builder stage
COPY --from=builder --chown=node:node /app/dist ./dist

# Set environment to production
ENV NODE_ENV=production

# Use non-root user for security
USER node

# Expose health check port
EXPOSE 3000

# Use dumb-init to handle SIGTERM properly
ENTRYPOINT ["dumb-init", "--"]

# Run the built JavaScript
CMD ["node", "dist/index.js"]
