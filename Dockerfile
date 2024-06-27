FROM node:18.16.0 as build-stage

ARG API_URL
ARG VUE_APP_LOGOUT_URL

ENV API_URL $API_URL
ENV VUE_APP_LOGOUT_URL $VUE_APP_LOGOUT_URL

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ .

RUN npm run build

FROM nginx as production-stage

RUN mkdir /app

COPY --from=build-stage /app/dist /app

COPY nginx.conf /etc/nginx/nginx.conf
