FROM node:13
ENV NODE_ENV development
WORKDIR /app
COPY ./package.json .
RUN npm install -g nodemon
RUN npm install
COPY . ./
EXPOSE 8082
CMD ["npm","run","dev"]