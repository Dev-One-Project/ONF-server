FROM node:16-alpine

WORKDIR /ONF/
COPY ./package.json /ONF/
RUN yarn install

RUN apk add tzdata && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

COPY . /ONF/

CMD yarn start:dev