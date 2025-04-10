# Use the official nginx image
FROM nginx:alpine

# Create nginx user with specific UID/GID
RUN adduser -D -S -H -u 1000 -g 'nginx' nginx

# Copy static files directly (no build needed for static HTML/JS/CSS)
COPY src/ /usr/share/nginx/html/

# Configure nginx
RUN echo 'server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}' > /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Switch to non-root user
USER nginx

EXPOSE 80

# Use exec form of CMD
CMD ["nginx", "-g", "daemon off;"]