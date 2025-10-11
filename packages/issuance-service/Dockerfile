# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install deps
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript → JavaScript
RUN npm run build

# Expose the port
EXPOSE 8081

# Start the service
CMD ["node", "dist/index.js"]
