FROM node:18.17

ENV VUE_APP_AUTH_API_URL 'http://localhost:3000/api/v1/auth'
ENV VUE_APP_INVITATION_API_URL 'http://localhost:3000/api/v1/profile-action'
ENV VUE_APP_MANAGE_USERS_API_URL 'http://localhost:3000/api/v1/profile-action'
ENV VUE_APP_IDEAS_API_URL 'http://localhost:3000/api/v1/idea'
ENV VUE_APP_COMMENT_API_URL 'http://localhost:3000/api/v1/comment'
ENV VUE_APP_MANAGE_GROUPS_API_URL 'http://localhost:3000/api/v1/group'

ENV PORT 8080

WORKDIR /main

COPY package.json /main

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["npm", "run", "serve"]