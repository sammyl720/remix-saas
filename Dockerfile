# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Remix application
RUN npm run build

# Stage 2: Production Stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the build output and public assets from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Set the default port value
ENV PORT=3000

# Expose the port (use the ENV variable)
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
