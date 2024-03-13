FROM node:18.17.0

WORKDIR /frontend

COPY package*.json ./
COPY yarn.lock ./


RUN yarn install

COPY . .

# COPY .env ./

RUN yarn build

EXPOSE 3001

CMD [ "yarn", "dev", "-p", "3001" ]
