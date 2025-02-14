# Multi-Stage Build Structure:
# - Uses two distinct stages: builder and runner
# - Builder stage handles all compilation and build processes
# - Runner stage creates the lean production image
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Optimized Image Size:
# Only copies specific files from builder resulting in a smaller image:
# - /app/next.config.js
# - /app/public 
# - /app/.next/standalone
# - /app/.next/static
FROM node:18-alpine AS runner
WORKDIR /app

# Production Optimizations:
# - Sets NODE_ENV production explicitly
# - Uses Next.js standalone output mode
# - Runs with node server.js instead of npm scripts
# - Copies only production-necessary files
ENV NODE_ENV=production

# Security Features:
# - Final image contains only runtime necessities
# - Build tools and source code stay in builder stage
# - Development dependencies excluded from final image
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

# Runs using node server.js instead of npm run start, which is more efficient
CMD ["node", "server.js"] 







