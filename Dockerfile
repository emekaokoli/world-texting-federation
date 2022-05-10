# FROM node:lts-alpine
# ENV NODE_ENV=production
# WORKDIR /src
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# # COPY .  /wtf-app
# RUN npm install --production --silent && mv node_modules ../
# EXPOSE 1339
# RUN chown -R node /src
# USER node
# CMD ["yarn", "start"]

FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /src
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install --production --silent && mv node_modules ../
COPY . ./src
# RUN yarn run build
# RUN chown -R node /src
EXPOSE 1339
USER node
CMD ["yarn", "start"]
