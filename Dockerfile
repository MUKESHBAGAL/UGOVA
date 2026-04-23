FROM node:20-alpine

WORKDIR /app

# Install dependencies first for caching
COPY package.json ./
RUN npm install

# Copy all files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
