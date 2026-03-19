# Sử dụng Node.js LTS bản nhẹ cho Docker image
FROM node:22-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy các file quản lý thư viện trước để tối ưu hóa việc cache Docker layers
COPY package*.json ./

# Cài đặt các dependencies cần thiết (chỉ production để nhẹ image)
RUN npm install --production

# Copy toàn bộ mã nguồn của bạn vào container
COPY . .

# Mở port mà ứng dụng Node.js sẽ lắng nghe
EXPOSE 5000

# Lệnh khởi chạy server (dùng node src/server.js thay vì nodemon trong Docker Production)
CMD ["node", "src/server.js"]
