Đây là một hiểu lầm rất phổ biến. Để truy cập vào giao diện quản lý, bạn hãy thử lại với địa chỉ: **[http://localhost:8761/](http://localhost:8761/)** (bỏ chữ `/eureka` ở cuối).

## 1. Tại sao lại có sự khác biệt này?

Eureka Server phân tách rõ ràng giữa hai đối tượng tương tác:

* **Giao diện Dashboard (Dành cho con người):** Nằm tại đường dẫn gốc `/`. Đây là nơi bạn xem trực quan các Service đang chạy (Instances currently registered), trạng thái RAM, CPU và chế độ Self-Preservation của Eureka.
* **API Endpoint (Dành cho máy móc):** Các đường dẫn như `/eureka` hoặc `/eureka/apps` là các API trả về dữ liệu dạng XML/JSON. Đây là nơi các Service con (như `order-service`, `payment-service`) gửi "nhịp tim" (**heartbeat**) và đăng ký danh tính.
  > **Lưu ý:** Nếu bạn vào bằng trình duyệt thông thường vào các đường dẫn API này mà không có tham số cụ thể, server thường trả về 404 hoặc lỗi định dạng vì nó không được thiết kế để hiển thị giao diện web tại đó.

## 2. Cách kiểm tra Eureka Server đã chạy thực sự chưa

Trước khi kết luận server lỗi, hãy kiểm tra 3 dấu hiệu "sống còn" sau:

1.  **Kiểm tra Console Log:** Trong IntelliJ/Eclipse, bạn phải tìm thấy dòng chữ:
    `Started DiscoveryServerApplication in ... seconds`
2.  **Kiểm tra Port:** Tìm dòng log báo Tomcat đã sẵn sàng:
    `Tomcat started on port 8761 (http)`
3.  **Truy cập đúng Dashboard:** Nhấn trực tiếp vào link: [http://localhost:8761/](http://localhost:8761/)

## 3. Cấu hình "chuẩn" cho Eureka Server (application.yml)

Để Eureka Server hoạt động ổn định và không tự đăng ký chính nó (gây rối Dashboard), bạn nên dùng cấu hình sau:

```yaml
	server:
	  port: 8761

	eureka:
	  client:
	    register-with-eureka: false # Server không cần tự đăng ký chính nó
	    fetch-registry: false       # Server không cần lấy danh sách từ server khác
	  instance:
	    hostname: localhost
```

---

### 💡 Mẹo nhỏ cho dự án java-learning:
Khi bạn bắt đầu chạy các Microservices con, hãy chú ý cột **Status** trên Dashboard. Nếu service hiện dòng chữ đỏ **EMERGENCY! EUREKA MAY BE INCORRECTLY CLAIMING INSTANCES ARE UP**, đó là chế độ *Self-Preservation* (Tự bảo tồn) — Eureka đang giữ lại danh sách service cũ vì nghi ngờ mạng chập chờn thay vì xóa chúng đi.
