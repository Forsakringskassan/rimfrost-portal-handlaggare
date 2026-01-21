# Stage 1: Build the Vite app with Node
FROM node:23-alpine AS builder

WORKDIR /app

ENV CI=true
ENV HUSKY=0

# Copy package files and install dependencies
COPY package*.json ./
RUN apk add --no-cache git
RUN npm ci

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Apache HTTP Server and inject runtime environment variables
FROM httpd:latest

USER 0

# Clean web root
RUN rm -rf /usr/local/apache2/htdocs/*

# Copy built app from builder stage
COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/

# Copy the runtime environment variable injection script
COPY env.sh /usr/local/bin/env.sh

# Make script executable and ensure Unix line endings
RUN chmod +x /usr/local/bin/env.sh && \
    sed -i 's/\r$//' /usr/local/bin/env.sh

# Pass version info and image name as build args
ARG NEXT_VERSION
ARG GIT_COMMIT
ARG IMAGE_NAME
ARG BUILD_DATE
ENV NEXT_VERSION=$NEXT_VERSION
ENV GIT_COMMIT=$GIT_COMMIT
ENV IMAGE_NAME=$IMAGE_NAME
ENV BUILD_DATE=$BUILD_DATE

# Set default port
ENV HTTPD_PORT=8080

# Create writable directories and set permissions for OpenShift/CRC
RUN mkdir -p /tmp/apache2/logs /tmp/apache2/run && \
    chown -R www-data:www-data /usr/local/apache2/htdocs /tmp/apache2 && \
    chmod -R 755 /usr/local/apache2/htdocs && \
    chmod -R 777 /tmp/apache2

# Create startup script that:
# 1. Runs runtime environment variable injection
# 2. Configures httpd with dynamic port and proper permissions
RUN echo '#!/bin/bash' > /usr/local/bin/start-httpd.sh && \
    echo '' >> /usr/local/bin/start-httpd.sh && \
    echo '# Run environment variable injection' >> /usr/local/bin/start-httpd.sh && \
    echo '/usr/local/bin/env.sh' >> /usr/local/bin/start-httpd.sh && \
    echo '' >> /usr/local/bin/start-httpd.sh && \
    echo '# Configure Apache' >> /usr/local/bin/start-httpd.sh && \
    echo 'PORT=${HTTPD_PORT:-8080}' >> /usr/local/bin/start-httpd.sh && \
    echo 'cp /usr/local/apache2/conf/httpd.conf /tmp/httpd.conf' >> /usr/local/bin/start-httpd.sh && \
    echo 'sed -i "s/Listen 80/Listen $PORT/" /tmp/httpd.conf' >> /usr/local/bin/start-httpd.sh && \
    echo 'sed -i "s|ErrorLog logs/error_log|ErrorLog /tmp/apache2/logs/error_log|" /tmp/httpd.conf' >> /usr/local/bin/start-httpd.sh && \
    echo 'sed -i "s|CustomLog logs/access_log|CustomLog /tmp/apache2/logs/access_log|" /tmp/httpd.conf' >> /usr/local/bin/start-httpd.sh && \
    echo 'sed -i "s|#PidFile logs/httpd.pid|PidFile /tmp/apache2/run/httpd.pid|" /tmp/httpd.conf' >> /usr/local/bin/start-httpd.sh && \
    echo 'echo "PidFile /tmp/apache2/run/httpd.pid" >> /tmp/httpd.conf' >> /usr/local/bin/start-httpd.sh && \
    echo 'echo "ServerName localhost" >> /tmp/httpd.conf' >> /usr/local/bin/start-httpd.sh && \
    echo '' >> /usr/local/bin/start-httpd.sh && \
    echo '# Display container information' >> /usr/local/bin/start-httpd.sh && \
    echo 'echo "Starting container: $IMAGE_NAME"' >> /usr/local/bin/start-httpd.sh && \
    echo 'echo "Version: $NEXT_VERSION"' >> /usr/local/bin/start-httpd.sh && \
    echo 'echo "Commit: $GIT_COMMIT"' >> /usr/local/bin/start-httpd.sh && \
    echo 'echo "Build date: $BUILD_DATE"' >> /usr/local/bin/start-httpd.sh && \
    echo 'echo "Listening on port: $PORT"' >> /usr/local/bin/start-httpd.sh && \
    echo 'echo ""' >> /usr/local/bin/start-httpd.sh && \
    echo '' >> /usr/local/bin/start-httpd.sh && \
    echo '# Start Apache' >> /usr/local/bin/start-httpd.sh && \
    echo 'httpd -D FOREGROUND -f /tmp/httpd.conf' >> /usr/local/bin/start-httpd.sh && \
    chmod +x /usr/local/bin/start-httpd.sh

# Switch to www-data user for security
USER www-data

          # Expose the configurable port
          EXPOSE $HTTPD_PORT

          # Use the startup script
          CMD ["/usr/local/bin/start-httpd.sh"]