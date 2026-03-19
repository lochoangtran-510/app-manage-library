# Dockerfile cho Frontend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Chạy ở cổng 5173
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
