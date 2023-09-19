FROM node:18.17

ENV PORT 8080

WORKDIR /main

COPY package.json /main

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["npm", "run", "serve"]