FROM nginx:alpine

WORKDIR /app

COPY . .

RUN apk add --update nodejs npm

RUN npm install

EXPOSE 3000


COPY <<EOF /start.sh
#!/bin/sh
nginx -g 'daemon on;'
node index.js
EOF

RUN chmod +x /start.sh

CMD ["/start.sh"]