FROM node:18.12

WORKDIR /ms-main

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
