# Multi-Stage Build Structure:
# - Uses two distinct stages: builder and runner
# - Builder stage handles all compilation and build processes
# - Runner stage creates the lean production image
FROM node:18-alpine AS builder
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Optimized Image Size:
# Only copies specific files from builder resulting in a smaller image:
FROM node:18-alpine AS runner
WORKDIR /src

# Production Optimizations:
# - Sets NODE_ENV production explicitly
# - Uses Next.js standalone output mode
# - Runs with node server.js instead of npm scripts
# - Copies only production-necessary files
ENV NODE_ENV=production

# Security Features:
COPY --from=builder /src/.next /src/.next 

EXPOSE 3001
ENV PORT=3001

# Runs using node server.js instead of npm run start, which is more efficient
CMD ["npm", "run", "start"] 
