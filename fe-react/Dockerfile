FROM node:alpine

ENV CI=true

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i 

COPY . . 


ENV REACT_APP_COMMON_DB_URL=https://db-svc:5006
ENV REACT_APP_POSTS_MS_URL=https://romany-app.com/api/posts
ENV REACT_APP_COMMENTS_MS_URL=https://comments-ms:5001/api
ENV REACT_APP_QUERY_MS_URL=https://query-ms:5002/api
ENV REACT_APP_MODERATION_MS_URL=https://moderation-ms:5003/api
ENV REACT_APP_EVENT_BUS_MS_URL=https://eventbus-ms:5005/api


EXPOSE 3000

CMD ["npm" , "start"]