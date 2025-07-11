FROM node:22-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]