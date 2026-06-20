FROM node:22-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node web/package.json ./web/package.json
COPY --chown=node:node shared/package.json ./shared/package.json

USER node

RUN npm ci --workspace=web

COPY --chown=node:node web ./web
COPY --chown=node:node shared ./shared

WORKDIR /app/web

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
