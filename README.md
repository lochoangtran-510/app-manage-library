# 📚 VibeLib - Hệ thống Quản lý Thư viện (Vibe Coding Project)

Chào mừng bạn đến với **VibeLib**! Đây là một dự án ứng dụng mô hình **"Vibe Coding"** - phong cách lập trình kết hợp sức mạnh của trí tuệ nhân tạo (AI) để phát triển một hệ thống Full-Stack (Frontend, Backend, Database) từ con số 0 đến khi hoàn thiện.

Dự án được thiết kế theo đúng quy chuẩn mô hình Thư viện hiện đại, bao gồm các phân hệ: **Admin**, **Thủ thư (Librarian)** và **Độc giả (Reader/Student)**.

---

## 🚀 Công nghệ sử dụng
- **Frontend**: React.js (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js, Sequelize ORM, JWT Authentication.
- **Database**: PostgreSQL.
- **Triển khai**: Docker & Docker Compose.

---

## 🛠️ Hướng dẫn cài đặt & Chạy dự án (Dành cho Tester)

Toàn bộ hệ thống đã được đóng gói sẵn trong Docker. Hãy đảm bảo máy tính của bạn đã cài **[Docker Desktop](https://www.docker.com/products/docker-desktop)**.

**Bước 1:** Clone mã nguồn về máy:
```bash
git clone https://github.com/lochoangtran-510/app-manage-library.git
cd app-manage-library
```

**Bước 2:** Chạy toàn bộ hệ thống chỉ bằng một lệnh duy nhất:
```bash
docker-compose up --build -d
```
*(Hệ thống tự động cài đặt PostgreSQL, Backend và Frontend. Chờ khoảng 1-2 phút.)*

**Bước 3:** Mở trình duyệt và truy cập:
- 🌐 Giao diện người dùng: `http://localhost:5173`
- ⚙️ Backend API: `http://localhost:5000`

---

## 🌱 Tài khoản mẫu (Tự động được tạo)

> **Không cần tạo tài khoản thủ công!** Dự án đã tích hợp cơ chế **Auto-Seeding** ngay trong Backend (`server.js`). Mỗi khi hệ thống khởi động lần đầu với Database trống, hai tài khoản mẫu sau đây sẽ được tạo **hoàn toàn tự động**:

### 👑 Tài khoản Admin
| Trường | Giá trị |
|--------|---------|
| Tên đăng nhập | `admin` |
| Mật khẩu | `admin123` |
| Quyền hạn | Quản lý tài khoản Thủ thư (thêm / sửa / xóa / vô hiệu hóa) |

> ⚠️ **Lưu ý:** Admin **không có** quyền truy cập các nghiệp vụ thư viện (sách, mượn/trả). Đây là hành vi được thiết kế theo đúng đặc tả phân quyền.

### 📚 Tài khoản Thủ thư
| Trường | Giá trị |
|--------|---------|
| Tên đăng nhập | `librarian01` |
| Mật khẩu | `lib123456` |
| Quyền hạn | Toàn quyền nghiệp vụ thư viện |

Thủ thư có thể:
- Quản lý **Chuyên ngành**, **Đầu sách** và **Bản sao vật lý**.
- Quản lý **Thẻ Độc giả** (sinh viên) và in thẻ.
- Xử lý **Mượn & Trả sách** bằng mã thẻ và barcode.
- Xem **Báo cáo thống kê**: Sách được mượn nhiều nhất, Độc giả quá hạn.

---

## 💡 Luồng kiểm thử cơ bản (Test Flow)

### Luồng 1: Sinh viên tra cứu sách (Không cần đăng nhập)
1. Truy cập `http://localhost:5173`.
2. Dùng thanh tìm kiếm để tra tên sách, tác giả.
3. Bấm vào sách để xem chi tiết và tình trạng từng bản sao (Sẵn sàng / Đang mượn).

### Luồng 2: Thủ thư làm nghiệp vụ Mượn sách
1. Đăng nhập bằng tài khoản `librarian01`.
2. Vào **Nghiệp vụ** → **Quản lý Kho sách** → Thêm **Chuyên ngành** mới (VD: `CNTT`).
3. Thêm một **Đầu sách** mới vào kho (điền số lượng bản sao khi tạo).
4. Vào **Quản lý Độc giả** → Đăng ký thẻ cho một sinh viên mới. Ghi lại **Mã thẻ** được cấp (VD: `LIB-12345678`).
5. Vào **Mượn & Trả sách** → Nhập Mã thẻ → Tìm sách → Bấm **Hoàn tất Phiếu mượn**.

### Luồng 3: Thủ thư ghi nhận Trả sách
1. Vào **Mượn & Trả sách** → Chuyển sang tab **Trả sách**.
2. Nhập Mã thẻ của độc giả đang mượn sách.
3. Chọn tình trạng sách khi nhận lại → Bấm **Xác nhận trả**.

---

## 🔄 Lưu ý khi Reset / Cài lại (Quan trọng!)

Nếu bạn muốn **xóa sạch dữ liệu và bắt đầu lại từ đầu** (hoặc sau khi pull code mới có thay đổi cấu trúc Database), hãy chạy:

```bash
docker-compose down -v
docker-compose up --build -d
```

> Lệnh `-v` sẽ xóa cả **ổ cứng ảo** (Docker Volume) chứa dữ liệu PostgreSQL. Sau khi khởi động lại, tài khoản mẫu sẽ được **tự động tạo lại** nhờ cơ chế Auto-Seeding.

---

*(Chúc bạn có những trải nghiệm thật "Vibe" với đồ án này!)* 🎉
