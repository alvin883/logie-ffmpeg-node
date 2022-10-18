FROM node:alpine3.16
RUN apk add ffmpeg
COPY . /app
WORKDIR /app
EXPOSE 3000
CMD npm start