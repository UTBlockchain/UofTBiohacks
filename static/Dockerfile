FROM node:8

WORKDIR /home/node
COPY --chown=node:node ./package.json /home/node/

USER node
RUN npm install -s

COPY --chown=node:node . /home/node

RUN npm run js-prod-min
RUN ./node_modules/.bin/webpack --config webpack.node.js
RUN ./node_modules/.bin/babel-node ./dist/app.node.js


FROM tianon/true

WORKDIR /app
COPY --from=0 /home/node/dist .