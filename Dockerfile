# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Create applogs directory for logging. the -p flag ensures that the directory is created if it does not exist.
RUN mkdir -p /app/applogs

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies using pnpm
# The --frozen-lockfile flag ensures that the lockfile is not modified during installation.
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start the application in development mode
CMD ["pnpm", "run", "start:dev"]