# ---- Stage 1: Build Stage ----
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- DEBUGGING STEP ---
# List the contents of the app directory to see if 'dist' was created.
RUN ls -la

# ---- Stage 2: Production Stage ----
FROM node:18-alpine AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]