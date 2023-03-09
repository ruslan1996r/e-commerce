FROM node:latest

WORKDIR /app

COPY package.json yarn.lock ./ 

ARG DEPLOY_ENV="staging"
ENV DEPLOY_ENV $DEPLOY_ENV

RUN yarn install --ignore-engines

COPY ./ ./

RUN npm run build

CMD ["node", "dist/main"]