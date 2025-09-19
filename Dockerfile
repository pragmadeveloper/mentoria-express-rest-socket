
FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production

RUN useradd --user-group --create-home --shell /bin/false appuser
USER appuser


EXPOSE 3000


CMD ["npm", "start"]