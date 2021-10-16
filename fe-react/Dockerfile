FROM node:alpine

ENV CI=true

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i 

COPY . . 


ENV REACT_APP_COMMON_DB_URL=http://db-svc:5006
ENV REACT_APP_POSTS_MS_URL=http://romany-app.com/api/posts
ENV REACT_APP_COMMENTS_MS_URL=http://comments-ms:5001/api
ENV REACT_APP_QUERY_MS_URL=http://query-ms:5002/api
ENV REACT_APP_MODERATION_MS_URL=http://moderation-ms:5003/api
ENV REACT_APP_EVENT_BUS_MS_URL=http://eventbus-ms:5005/api


EXPOSE 3000

CMD ["npm" , "start"]