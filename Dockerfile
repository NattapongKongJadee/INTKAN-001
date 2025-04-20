# Stage 1: Build the Next.js application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps



# Copy all the project files
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Serve the Next.js application
FROM node:18-alpine AS production

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy the build output and node_modules from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Expose port 3000
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
