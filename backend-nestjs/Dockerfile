# Use Node 22 (since local uses v22/26) or 20 for stability
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

# Install docker CLI so the NestJS backend can communicate with the host Docker daemon
RUN apk add --no-cache docker-cli

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Create a non-root user for security (optional, but good practice). 
# Note: Since we need to access docker.sock, root is often easier, or we must ensure the node user is in the docker group.
# For EC2 simplicity in DooD, we'll run as root inside the container.

EXPOSE 5001

CMD ["node", "dist/main.js"]
