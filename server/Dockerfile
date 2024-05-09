FROM node:21-alpine as builder
WORKDIR /server

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run compile
EXPOSE 8443

CMD ["npm", "start"]
