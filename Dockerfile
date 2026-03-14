FROM node:20-slim

WORKDIR /app
COPY . .

WORKDIR /app/server
RUN npm install
RUN npm run generate-cache

ENV NODE_ENV=production
ENV DB_HOST=localhost
ENV DB_USER=root
ENV DB_PASS=password

EXPOSE 8080

CMD ["node", "app.js"]