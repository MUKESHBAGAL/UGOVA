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
ENV HOSTNAME=0.0.0.0

# Build the application
RUN npm run build

# Copy static files to standalone directory
RUN cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
RUN cp -r public .next/standalone/ 2>/dev/null || true

# Expose port
EXPOSE 3000

# Start the standalone server
CMD ["node", ".next/standalone/server.js"]
