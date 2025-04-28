FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

VOLUME ["/app/uploads"] 

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
