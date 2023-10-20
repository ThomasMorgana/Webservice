FROM node:alpine

WORKDIR /app

COPY package*.json ./

COPY src/ ./src/

COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD npm run build
CMD npm run dev