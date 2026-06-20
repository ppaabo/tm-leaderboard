FROM node:20-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node api/package.json ./api/package.json
COPY --chown=node:node shared/package.json ./shared/package.json

USER node

RUN npm ci --workspace=api

COPY --chown=node:node api ./api
COPY --chown=node:node shared ./shared

WORKDIR /app/api

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
