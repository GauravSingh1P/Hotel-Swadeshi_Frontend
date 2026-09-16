FROM nginx:alpine

# Copy all files from the current directory to Nginx's default HTML folder
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
