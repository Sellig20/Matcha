FROM node:alpine

WORKDIR /usr/src/app

# COPY . .
COPY package*.json ./

RUN npm install

RUN npm install -g nodemon ts-node typescript

EXPOSE 3000

CMD ["nodemon", "--watch", "./", "--exec", "ts-node", "./index.ts"]