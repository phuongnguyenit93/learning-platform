Nếu bạn đang làm việc với các ứng dụng Java (như Spring Boot) và muốn tối ưu hóa hiệu suất, thì **HikariCP** chính là "ngôi sao sáng" bạn cần biết. Đây là thư viện Connection Pool mặc định của Spring Boot nhờ tốc độ cực nhanh và sự gọn nhẹ.

## 1. Vai trò của HikariCP trong hệ thống

Hãy tưởng tượng việc mở một kết nối (Connection) tới DB giống như việc xây một cây cầu mới mỗi khi có người muốn qua sông. Việc này cực kỳ tốn thời gian và tài nguyên. HikariCP đóng vai trò là một **"Bến xe buýt" (Connection Pool)**:

* **Duy trì sẵn kết nối:** Thay vì tạo mới và đóng liên tục, HikariCP tạo ra một nhóm các kết nối sẵn có và giữ chúng ở trạng thái chờ.
* **Tái sử dụng (Reuse):** Khi ứng dụng cần truy vấn, nó "mượn" một kết nối từ pool. Sau khi dùng xong, kết nối được trả lại pool thay vì bị hủy bỏ.
* **Quản lý vòng đời:** Tự động kiểm tra các kết nối "chết", quản lý timeout và đảm bảo số lượng kết nối luôn nằm trong giới hạn để không làm quá tải Database.

## 2. Tại sao HikariCP lại được ưa chuộng đến thế?

Hikari (tiếng Nhật nghĩa là "Ánh sáng") được thiết kế với triết lý tối giản và hiệu quả cực cao:

| Đặc điểm | Mô tả |
| :--- | :--- |
| **Tốc độ (Performance)** | Sử dụng kỹ thuật tối ưu hóa bytecode và cấu trúc dữ liệu vi mô để giảm thiểu độ trễ (latency). |
| **Gọn nhẹ (Lightweight)** | File JAR cực kỳ nhỏ (~130KB), giảm gánh nặng cho bộ nhớ ứng dụng. |
| **Độ tin cậy (Reliability)** | Xử lý cực tốt các tình huống rớt mạng hoặc DB khởi động lại mà không làm treo ứng dụng. |
| **Cấu hình thông minh** | Các tham số mặc định đã được tối ưu hóa rất tốt, thường không cần chỉnh sửa nhiều. |

## 3. Cấu hình thực tế trong Spring Boot

Trong Spring Boot, bạn chỉ cần khai báo thông tin DB trong file `application.properties`, hệ thống sẽ tự động kích hoạt HikariCP:

```properties
	# Thông tin kết nối cơ bản
	spring.datasource.url=jdbc:mysql://localhost:3306/mydb
	spring.datasource.username=root
	spring.datasource.password=123456

	# Cấu hình tối ưu cho Hikari Pool (Tùy chọn)
	# Số lượng kết nối tối đa trong pool
	spring.datasource.hikari.maximum-pool-size=10
	# Thời gian tối đa một kết nối được phép rảnh trước khi bị giải phóng (ms)
	spring.datasource.hikari.idle-timeout=30000
	# Thời gian tối đa chờ đợi để mượn một kết nối từ pool (ms)
	spring.datasource.hikari.connection-timeout=20000
```

---
