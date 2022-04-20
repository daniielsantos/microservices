FROM node:17-alpine
WORKDIR /app
COPY package.json /app
RUN npm install && npm install typescript -g
COPY . /app
EXPOSE 8001
RUN tsc
CMD ["node", "./dist/app.js"]
