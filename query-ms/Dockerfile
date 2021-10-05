FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i 

COPY . . 

ENV PORT=5002
ENV COMMON_DB_URL=http://db-svc:5006
ENV POSTS_MS_URL=http://posts-ms:5000/api
ENV COMMENTS_MS_URL=http://comments-ms:5001/api
ENV QUERY_MS_URL=http://query-ms:5002/api
ENV MODERATION_MS_URL=http://moderation-ms:5003/api
ENV EVENT_BUS_MS_URL=http://eventbus-ms:5005/api


EXPOSE 5002

CMD ["npm" , "run" , "dev"]