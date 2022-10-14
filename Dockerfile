# syntax=docker/dockerfile:1.4
FROM node:16.14.2-buster
RUN npm install -g @nestjs/cli@9.1.1
WORKDIR /app/
COPY --link ./ /app/
RUN npm ci
CMD ["npm", "run", "start:dev"]
