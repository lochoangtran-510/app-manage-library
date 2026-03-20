# Dockerfile cho Frontend (Tối ưu cho Docker)
FROM node:22-alpine

WORKDIR /app

# Copy file quản lý dependencies trước để cache Docker layer
COPY package.json package-lock.json ./

# npm ci cài đúng phiên bản từ lockfile - nhanh và ổn định hơn npm install
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Expose cổng 5173
EXPOSE 5173

# Chạy Vite dev server với --host để Docker expose ra ngoài
CMD ["npm", "run", "dev"]
