FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Set environment variables for build
ENV NEXT_PUBLIC_API_URL=http://api.codeskill.io/api

# Build Next.js
RUN npm run build

# Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Next.js standalone output is highly recommended for Docker.
# Make sure "output: 'standalone'" is in next.config.ts!
# If it's not, this will fallback to normal start

COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
