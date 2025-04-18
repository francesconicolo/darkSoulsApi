FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN chmod +x node_modules/.bin/* 

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
