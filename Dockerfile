FROM nginx:alpine

# Copy all files from the current directory to Nginx's default HTML folder
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# The PORT environment variable is injected by Render. We default to 80 for local development.
CMD sed -i -e 's/listen       80;/listen       '"${PORT:-80}"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
