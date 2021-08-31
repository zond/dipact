FROM node:14 AS web-app-base

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . ./

FROM web-app-base AS web-app
CMD ["yarn", "start"]

FROM web-app-base AS web-app-storybook
CMD ["yarn", "storybook"]