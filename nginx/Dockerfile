FROM docker.io/library/nginx:latest as build
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 
ENTRYPOINT ["nginx", "-g", "daemon off;"]