FROM node:21-alpine as builder

LABEL maintainer="Sebastian Enns <mail@sebenns.com>"
LABEL description="GraphQL+Neo4j DSE Angular client."

WORKDIR /client

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run compile
EXPOSE 8443

CMD ["npm", "start"]
