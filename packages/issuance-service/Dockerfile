# --- Stage 1: Build the TypeScript Application ---
# Use the official Node.js v22 image (alpine version) to match your local environment.
# 'alpine' is a lightweight version of Linux, making our final image smaller.
FROM node:22-alpine AS build

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for layer caching.
# This makes future builds faster if dependencies haven't changed.
COPY package*.json ./

# Install all project dependencies, including devDependencies needed for building.
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Build the TypeScript code into JavaScript, outputting to the /dist folder.
RUN npm run build

# --- Stage 2: Run the Production Application ---
# Start a new, clean image for the production environment.
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files again.
COPY package*.json ./

# Install ONLY production dependencies. This is a key optimization to keep the
# final image small and secure, as it excludes all devDependencies (like TypeScript).
RUN npm install --omit=dev

# Copy the compiled JavaScript code from the 'build' stage.
# We do not copy the original TypeScript source code into the final image.
COPY --from=build /usr/src/app/dist ./dist

# Expose the port the service will listen on (this will be different for each service).
# For issuance-service, it's 8081. For verification-service, it's 8082.
# The EXPOSE instruction is documentation; the actual port mapping is done in docker-compose.yml.
EXPOSE 8081

# The command to start the service when the container launches.
CMD ["node", "dist/index.js"]
