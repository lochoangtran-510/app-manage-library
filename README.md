# 📚 VibeLib - Hệ thống Quản lý Thư viện (Vibe Coding Project)

Chào mừng bạn đến với **VibeLib**! Đây là một dự án ứng dụng mô hình **"Vibe Coding"** - phong cách lập trình kết hợp sức mạnh của trí tuệ nhân tạo (AI) để phát triển một hệ thống Full-Stack (Frontend, Backend, Database) từ con số 0 đến khi hoàn thiện.

Dự án này được thiết kế theo đúng quy chuẩn mô hình Thư viện hiện đại, bao gồm các phân hệ: Admin, Thủ thư (Librarian) và Độc giả (Reader/Student).

---

## 🚀 Công nghệ sử dụng
- **Frontend**: React.js (Vite), Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js, Sequelize (ORM), JSON Web Token (JWT).
- **Database**: PostgreSQL.
- **Triển khai**: Docker & Docker Compose.

---

## 🛠️ Hướng dẫn cài đặt & Chạy dự án (Dành cho Tester)

Mọi thứ đã được đóng gói sẵn trong Docker nên việc cài đặt cực kỳ đơn giản. Đảm bảo máy tính của bạn đã cài đặt **[Docker Desktop](https://www.docker.com/products/docker-desktop)**.

**Bước 1:** Clone mã nguồn về máy:
```bash
git clone <địa_chỉ_repo_github_của_bạn>
cd vibe-coding2
```

**Bước 2:** Chạy toàn bộ hệ thống bằng Docker Compose:
```bash
docker-compose up --build -d
```
*(Hệ thống sẽ tự động cài đặt Database Postgres, cấu hình Backend và khởi chạy Frontend. Cứ pha một tách cà phê và chờ khoảng 1-2 phút nhé!)*

**Bước 3:** Truy cập ứng dụng:
- Giao diện web đã sẵn sàng tại: `http://localhost:5173`
- Backend API chạy ngầm tại: `http://localhost:5000`

---

## 🔐 Tài khoản Test (Tài khoản mồi)

Khi hệ thống khởi chạy lần đầu tiên qua Docker, một Super Admin và một Thủ thư mẫu đã được tạo tự động để bạn có thể vào test ngay lập tức các nghiệp vụ:

### 1. Tài khoản Super Admin
- **Tên đăng nhập:** `admin`
- **Mật khẩu:** `admin123`
- *Quyền hạn:* Có thể thêm/xóa/Sửa các tài khoản "Thủ thư", xem báo cáo thống kê chuyên sâu.

### 2. Tài khoản Thủ thư (Librarian)
- **Tên đăng nhập:** `librarian01`
- **Mật khẩu:** `lib123456`
- *Quyền hạn:* 
  - Quản lý phân mục chuyên ngành và danh sách các quyển sách vật lý.
  - Quản lý Độc giả (sinh viên) và có thể "In thẻ" xịn xò.
  - Xử lý mượn/trả sách bằng mã Thẻ Độc Giả và Mã vạch (Barcode).
  - Kiểm tra thống kê danh sách độc giả quá hạn.

---

## 💡 Hướng dẫn luồng Nhiệp vụ cơ bản (Test Flow)
1. **Dành cho Sinh viên (Không đăng nhập)**: Tra cứu tên sách trên thanh tìm kiếm xem sách còn trên kệ không. Rút sách ra mang đến quầy.
2. **Dành cho Thủ thư (Đã đăng nhập)**: 
   - Đăng kí thẻ cho sinh viên (nếu chưa có).
   - Vào menu `Nghiệp vụ` -> `Mượn & Trả sách`.
   - Nhập mã thẻ sinh viên báo (VD: `LIB-12345678`), tiếp tục gõ tên sách hoặc quét barcode để chọn quyển sách khớp.
   - Bấm **Hoàn tất**! Hệ thống sẽ xử lý trừ sách trong kho.

*(Chúc bạn có những trải nghiệm thật "Vibe" với đồ án này!)* 🎉
