FROM node:18.17.0

WORKDIR /backend

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

# COPY .env ./

RUN yarn build

EXPOSE 3100

CMD [ "yarn", "start:dev" ]
