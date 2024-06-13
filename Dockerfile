FROM node:18.16.0 as build-stage

# env
ARG API_URL
ENV API_URL=${API_URL}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ .

RUN npm run build

FROM nginx as production-stage

RUN mkdir /app

COPY --from=build-stage /app/dist /app

COPY nginx.conf /etc/nginx/nginx.conf

# скрипт для замены переменных окружения
COPY ./replace_env.sh /docker-entrypoint.d/

# скрипт исполняемым
RUN chmod +x /docker-entrypoint.d/replace_env.sh