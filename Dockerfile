# Use Node.js LTS version
FROM node:16

# Set working directory
WORKDIR /app

# Copy the entire application
COPY . .

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Install http-server globally for serving the client
RUN npm install -g http-server

# Expose ports
# 2000 - Server (dev)
# 8000 - Client
EXPOSE 2000 8000

# Environment variables for database connection
ENV DB_HOST=localhost
ENV DB_USER=root
ENV DB_PASS=password

# Create a startup script
WORKDIR /app
RUN echo '#!/bin/bash\ncd /app/server && node app.js &\ncd /app/client && http-server -p 8000 &\nwait' > start.sh && \
    chmod +x start.sh

# Start both server and client
CMD ["/bin/bash", "start.sh"]
