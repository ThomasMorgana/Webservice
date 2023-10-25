FROM node:18-alpine as base
WORKDIR /app
EXPOSE 8082

FROM base as dev
CMD npm install && npx prisma generate && npx prisma migrate deploy && npm run seed && npm start

FROM base as prod
COPY . .
RUN npm install --production
CMD npx prisma generate && npx prisma migrate deploy && npm start