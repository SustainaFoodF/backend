FROM node:18-alpine
WORKDIR /app
COPY . /app
RUN npm install -g npm@11.3.0
RUN npm install
RUN npm run build-dev
EXPOSE 5000
CMD ["npm", "start"]