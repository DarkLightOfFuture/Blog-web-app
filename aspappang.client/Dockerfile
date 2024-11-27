#Angular
FROM node:18 AS build
WORKDIR /usr/src/app

COPY . /usr/src/app
COPY node_modules /usr/src/app
COPY *.json /usr/src/app

#Installation of angular's dependencies
RUN npm install -g @angular/cli --legacy-peer-deps
RUN npm install

RUN npm install --legacy-peer-deps @angular-devkit/build-angular
RUN npm install --legacy-peer-deps typescript@latest -g

RUN npm install --legacy-peer-deps @angular/core
RUN npm install --legacy-peer-deps @angular/compiler-cli
RUN npm install --legacy-peer-deps @angular/compiler
RUN npm install --legacy-peer-deps @angular/animations
RUN npm install --legacy-peer-deps @angular/router
RUN npm install --legacy-peer-deps @angular/platform-browser
RUN npm install --legacy-peer-deps @ngrx/store
RUN npm install --legacy-peer-deps @angular/forms
RUN npm install --legacy-peer-deps @ngrx/effects
RUN npm install --legacy-peer-deps @angular/platform-browser-dynamic
RUN npm install --legacy-peer-deps zone.js
RUN npm install --legacy-peer-deps ngx-cookie-service
RUN npm install --legacy-peer-deps quill
RUN npm install --legacy-peer-deps @angular/common
RUN npm install --legacy-peer-deps process

ARG configuration=production
RUN npm run build

#Nginx
FROM nginx:stable AS ngi

COPY --from=build /usr/src/app/dist/aspappang.client/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/
COPY /ssl /etc/nginx/ssl

EXPOSE 443
