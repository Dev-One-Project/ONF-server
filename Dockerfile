FROM node:16-alpine

WORKDIR /ONF/
COPY ./package.json /ONF/
RUN yarn install

COPY . /ONF/

CMD yarn start:dev