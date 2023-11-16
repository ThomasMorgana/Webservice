FROM node:18-alpine as base
WORKDIR /app
EXPOSE 8082

COPY . .
CMD npm run deploy:gcp