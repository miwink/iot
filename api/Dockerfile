FROM node:latest

WORKDIR /app

COPY  package.json .

RUN ["npm", "install"]

COPY ./src src

RUN ["npm", "run", "build"]

CMD ["node", "./dist/index.js"]