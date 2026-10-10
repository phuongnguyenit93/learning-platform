Đây là một vấn đề cực kỳ quan trọng khi làm việc với Spring Cloud Config. Khi có sự xung đột giữa cấu hình tại Config Server và cấu hình nội bộ (file `application.yml` nằm trong chính service đó), Spring áp dụng các quy tắc rất chặt chẽ.

### 1. Quy tắc mặc định: Config Server là "Vua"
Mặc định, các cấu hình lấy từ Remote Config Server sẽ có độ ưu tiên **CAO HƠN** các file cấu hình nội bộ.

**Thứ tự ưu tiên từ cao xuống thấp:**
1.  **Config Server:** File cấu hình theo profile (ví dụ: `order-service-dev.yml`).
2.  **Config Server:** File cấu hình theo tên service (`order-service.yml`).
3.  **Config Server:** File `application.yml` (nằm trong config-repo, dùng chung cho tất cả).
4.  **Nội bộ Service:** File `application.yml` (nằm trong thư mục `src/main/resources` của project).

> **Ví dụ thực tế:**
> * Trong `config-repo/order-service.yml` bạn để: `server.port: 8881`
> * Trong `src/main/resources/application.yml` (nội bộ) bạn để: `server.port: 8080`
> * **Kết quả:** Khi chạy, service sẽ nhận port **8881**.

### 2. Tại sao lại ưu tiên Config Server?
Triết lý của Microservices là **"Externalize Configuration"** (Đưa cấu hình ra ngoài). Ý tưởng là bạn có thể thay đổi hành vi của ứng dụng (như đổi DB URL, tắt/mở tính năng) mà không cần phải build lại file JAR. Nếu cấu hình nội bộ thắng, thì Config Server sẽ mất đi ý nghĩa "điều khiển tập trung".

### 3. Cách "lật ngược thế cờ" (Override)
Nếu bạn muốn cấu hình nội bộ của service có quyền ghi đè những gì Config Server gửi xuống, bạn phải cấu hình tại **Config Server** (file trong repo) để cho phép điều này:

```yaml
	spring:
	  cloud:
	    config:
	      # Cho phép client ghi đè cấu hình từ server
	      allow-override: true 
	      # Cấu hình nội bộ sẽ thắng cấu hình từ server
	      override-none: true 
	      # Chỉ ghi đè nếu cấu hình đó không tồn tại ở hệ thống/biến môi trường
	      override-system-properties: false 
```

### 4. Tổng kết bảng thứ tự ưu tiên thực tế (Full Stack)

| Độ ưu tiên | Nguồn cấu hình |
| :--- | :--- |
| **1 (Cao nhất)** | Đối số dòng lệnh (Command line arguments: `--server.port=9000`) |
| **2** | Thuộc tính từ **Config Server** |
| **3** | Biến môi trường (OS Environment Variables) |
| **4** | File cấu hình nội bộ (`application.yml` trong JAR) |
| **5 (Thấp nhất)** | Giá trị mặc định trong code Java |

---
**Mẹo:** Trong môi trường Production, người ta thường dùng **Biến môi trường** hoặc **Config Server** để đảm bảo tính linh hoạt mà không cần can thiệp vào file JAR đã đóng gói.
