FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./ 

RUN npm i 

COPY . . 

ENV PORT=5005
ENV COMMON_DB_URL=http://localhost:7000
ENV POSTS_MS_URL=http://localhost:5000/api
ENV COMMENTS_MS_URL=http://localhost:5001/api
ENV QUERY_MS_URL=http://localhost:5002/api
ENV MODERATION_MS_URL=http://localhost:5003/api
ENV EVENT_BUS_MS_URL=http://localhost:5005/api


EXPOSE 5005


CMD ["npm", "run", "dev"]