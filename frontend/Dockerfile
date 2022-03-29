FROM docker.io/library/node:latest as build
WORKDIR /src/app
COPY package.json package-lock.json .
RUN npm install
COPY . . 
RUN npm run build

FROM docker.io/library/nginx:latest as final
COPY --from=build /src/app/build /usr/share/nginx/html
EXPOSE 80 
ENTRYPOINT ["nginx", "-g", "daemon off;"]