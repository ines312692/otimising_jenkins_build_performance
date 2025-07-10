FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir dist #construit le dossier dist

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
#copie le dossier dist dans le dossier html de nginx

EXPOSE 90

CMD ["nginx", "-g", "daemon off;"]
