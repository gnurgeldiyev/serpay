FROM node:10.13

ENV APP_ROOT /src

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN yarn install
RUN yarn run build

ENV HOST 127.0.0.1

# Clear the cache
#RUN yarn cache clean