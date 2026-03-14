# Use Node LTS
FROM node:20-slim

# App directory
WORKDIR /app

# Copy project
COPY . .

# Install backend dependencies
WORKDIR /app/server
RUN npm install

# Generate cache
RUN npm run generate-cache

# Environment variables (optional defaults)
ENV NODE_ENV=production
ENV DB_HOST=localhost
ENV DB_USER=root
ENV DB_PASS=password

# Cloud Run expects the container to listen on this port
EXPOSE 8080

# Start backend (which should also serve /client statics)
CMD ["node", "app.js"]