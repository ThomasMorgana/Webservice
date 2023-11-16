FROM node:18-alpine as base
WORKDIR /app
EXPOSE 8082

FROM base as dev
CMD npm run docker:dev

FROM base as prod
COPY . .
CMD npm run docker:prod