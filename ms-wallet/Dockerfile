FROM node:18.12

WORKDIR /ms-wallet

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
