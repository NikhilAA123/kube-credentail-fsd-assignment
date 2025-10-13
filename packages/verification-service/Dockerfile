# --- Stage 1: Build the TypeScript Application ---
# Use the official Node.js v22 image (alpine version) for a small and consistent environment.
FROM node:22-alpine AS build

# Set the working directory.
WORKDIR /usr/src/app

# Copy package files first to leverage Docker's layer caching, making future builds faster.
COPY package*.json ./

# Install all dependencies, including devDependencies needed for the build.
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Build the TypeScript code into JavaScript in the /dist folder.
RUN npm run build

# --- Stage 2: Run the Production Application ---
# Start a new, clean, and lightweight image for production.
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files again.
COPY package*.json ./

# Install ONLY production dependencies to keep the final image small and secure.
RUN npm install --omit=dev

# Copy the compiled JavaScript code from the 'build' stage.
# The original TypeScript source is not included in the final image.
COPY --from=build /usr/src/app/dist ./dist

# Expose the port the service will listen on.
# For the verification-service, this should be 8082.
EXPOSE 8082

# The command to start the service when the container launches.
CMD ["node", "dist/index.js"]
