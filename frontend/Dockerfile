# --- Stage 1: Build the React Application ---
# Use the official Node.js v22 image to match your local environment.
FROM node:22-alpine AS build

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json files first for layer caching.
COPY package*.json ./

# Install project dependencies.
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Build the application for production.
RUN npm run build

# --- Stage 2: Serve the Static Files ---
# Start a new, clean image for the production server.
FROM node:22-alpine

WORKDIR /app

# Install the 'serve' static file server globally.
RUN npm install -g serve

# Copy ONLY the built static files from the 'build' stage.
COPY --from=build /app/dist .

# Expose the default port for the 'serve' package.
EXPOSE 3000

# The command to start the web server.
CMD ["serve", "-s", "."]