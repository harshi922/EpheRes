FROM node:16.18

ENV PORT=3000
ENV CHOKIDAR_USEPOLLING=true
ENV WDS_SOCKET_PORT=0
ENV NODE_ENV=development
ENV WATCHPACK_POLLING=true

COPY . /frontend-react-js
WORKDIR /frontend-react-js
RUN npm install
EXPOSE ${PORT}
CMD ["npm", "start"]