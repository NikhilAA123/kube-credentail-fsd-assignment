# ---- Stage 1: Build Stage ----
# We use a specific version of Node.js for consistency.
# The 'as builder' names this stage so we can refer to it later.
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
# This is done first to leverage Docker's layer caching.
COPY package*.json ./

# Install all dependencies, including development ones needed for building
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Compile the TypeScript code into JavaScript
# This command runs the "build" script from your package.json
RUN npm run build

# ---- Stage 2: Production Stage ----
# This stage creates the final, lean image.
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary package files
COPY package*.json ./

# Install ONLY production dependencies to keep the image small
RUN npm install --omit=dev

# Copy the compiled JavaScript code from the 'builder' stage
# This is the key part of a multi-stage build. We don't copy the source TypeScript.
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 3001

# The command to run when the container starts
CMD ["node", "dist/index.js"]