FROM nginx:alpine

WORKDIR /app

COPY . .

RUN apk add --update nodejs npm

RUN npm install

EXPOSE 3000

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]