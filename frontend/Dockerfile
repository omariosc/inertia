FROM docker.io/library/node:latest as build
WORKDIR /src/app
COPY package.json ./
RUN npm install
COPY . .
RUN echo "let host = '';\nexport default host;" > src/host.js
RUN npm run build

FROM docker.io/library/nginx:latest as final
COPY --from=build /src/app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]