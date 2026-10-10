Cấu hình đúng các thông số của HikariCP là yếu tố then chốt để hệ thống chạy mượt mà, tránh lỗi `Connection is not available` hoặc làm treo Database.

## 1. maximumPoolSize (Số lượng kết nối tối đa)
Đây là giới hạn cao nhất số lượng kết nối mà Pool có thể tạo ra.
* **Sai lầm:** Cho rằng số này càng lớn càng tốt. Thực tế, quá nhiều kết nối gây nghẽn cổ chai tại CPU và Disk I/O của Database.
* **Công thức gợi ý (từ tác giả HikariCP):**
  $$connections = ((core\_count \times 2) + effective\_spindle\_count)$$
  *(Trong đó `core_count` là số CPU và `spindle_count` là số ổ đĩa cứng).*
* **Lời khuyên:** Bắt đầu với con số nhỏ (ví dụ: 10) và tăng dần nếu hệ thống bị nghẽn.

## 2. minimumIdle (Số lượng kết nối rảnh tối thiểu)
Số lượng kết nối mà HikariCP duy trì ở trạng thái "ngủ" để sẵn sàng phục vụ ngay.
* **Khuyến nghị:** HikariCP khuyên để giá trị này **bằng** với `maximumPoolSize`.
* **Lợi ích:** Giúp Pool ổn định, tránh việc liên tục tạo mới và hủy kết nối (vốn rất tốn tài nguyên).

## 3. connectionTimeout (Thời gian chờ kết nối)
Thời gian tối đa (ms) ứng dụng sẽ đợi để mượn được một kết nối từ Pool.
* **Giá trị mặc định:** 30000 (30 giây).
* **Lời khuyên:** Nếu sau 30 giây vẫn không lấy được kết nối, chứng tỏ Pool quá tải hoặc DB có vấn đề. Không nên tăng số này quá cao vì sẽ khiến người dùng phải chờ đợi "vô tận".

## 4. maxLifetime (Thời gian sống tối đa)
Thời gian tối đa một kết nối tồn tại trong Pool trước khi bị thay thế.
* **Lưu ý:** Giá trị này **bắt buộc** phải ngắn hơn giới hạn `wait_timeout` của Database (MySQL mặc định là 8 tiếng).
* **Khuyến nghị:** Khoảng 30 phút (1,800,000 ms) là con số an toàn.

---

## 🛠️ Cấu hình mẫu trong application.yml (Spring Boot)

```yaml
	spring:
	  datasource:
	    hikari:
	      maximum-pool-size: 20
	      minimum-idle: 20
	      connection-timeout: 30000
	      max-lifetime: 1800000
	      idle-timeout: 600000
	      pool-name: MyHikariCP-Pool
```

## 📈 Cách kiểm tra (Monitoring)

Để biết các thông số trên đã tối ưu chưa, bạn nên bật **Metrics** (qua Actuator & Micrometer):
* **Active Connections chạm ngưỡng max:** Cần tăng size hoặc tối ưu lại code (đóng kết nối sớm hơn).
* **Wait Time tăng cao:** Hệ thống đang bị nghẽn ở tầng Database (Disk hoặc CPU của DB server).

---
