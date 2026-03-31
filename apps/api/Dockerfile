# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and package workspace files
COPY package*.json ./
COPY packages/types/package*.json ./packages/types/
COPY apps/api/package*.json ./apps/api/

# Install dependencies (using workspaces)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the shared packages first
RUN npm run build --workspace=@resumeforge/types

# Build the API
RUN npm run build --workspace=api

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/types/package*.json ./packages/types/
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Expose the API port
EXPOSE 3001

# Set the working directory to the API app
WORKDIR /app/apps/api

# Command to run the production build
CMD ["node", "dist/main"]
