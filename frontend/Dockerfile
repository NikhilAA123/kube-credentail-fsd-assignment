# --- Stage 1: Build the React Application ---
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency files first
COPY package*.json ./
RUN npm install

# Copy all project files including .env (make sure it's not in .dockerignore)
COPY . .

# ✅ Ensure .env is explicitly copied (important!)
COPY .env .env

# Build the production build
RUN npm run build

# --- Stage 2: Serve the Static Files ---
FROM node:22-alpine

WORKDIR /app

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Copy built app from previous stage
COPY --from=build /app/dist .

EXPOSE 3000

CMD ["serve", "-s", "."]
