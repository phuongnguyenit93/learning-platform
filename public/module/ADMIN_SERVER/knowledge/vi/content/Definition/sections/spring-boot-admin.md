Nếu Eureka là "danh bạ điện thoại" thì Spring Boot Admin (SBA) chính là "phòng giám sát camera" cho toàn bộ hệ thống Microservices của bạn.

Trong khi Eureka chỉ cho bạn biết Service A có đang sống hay không, thì Spring Boot Admin cho bạn xem "nội tạng" của Service A đang hoạt động thế nào thông qua một giao diện Web (UI) cực kỳ chuyên nghiệp.

### 1. Spring Boot Admin giúp bạn xem được những gì?
Nó thu thập dữ liệu từ các Actuator Endpoints của từng service và hiển thị lên dashboard:

* **Thông số phần cứng:** Theo dõi RAM, CPU, Heap Memory theo thời gian thực (rất quan trọng khi bạn test Virtual Threads).
* **Quản lý Log:** Có thể đổi Level Log (từ `INFO` sang `DEBUG`) của một service đang chạy ngay trên giao diện mà không cần restart.
* **Chi tiết Luồng (Thread Dump):** Xem danh sách tất cả các Thread đang chạy, cái nào đang bị Block, cái nào đang hoạt động.
* **HTTP Tracing:** Xem danh sách các request gần nhất vừa đi qua service đó (thời gian xử lý, status code).
* **Environment:** Xem toàn bộ biến môi trường và file cấu hình mà service đang sử dụng.

### 2. Tại sao bạn nên dùng nó trong dự án java-learning?
Thay vì phải gõ những đường dẫn loằng ngoằng và đọc file JSON thô của Spring Actuator như:  
`http://localhost:8081/actuator/metrics/jvm.memory.used`

Bạn chỉ cần vào Spring Boot Admin UI, mọi thứ đều có biểu đồ, màu sắc và nút bấm trực quan.

### 3. Cách thiết lập trong cấu trúc Multi-module
SBA hoạt động theo mô hình **Server - Client**.

* **Bước 1: Tạo module `infrastructure/admin-server`**
    * Dependency: `codecentric:spring-boot-admin-starter-server`
    * Main class: Thêm `@EnableAdminServer`.
    * **Kết nối với Eureka:** Cấu hình để Admin Server cũng là một Eureka Client. Khi đó, hễ có service nào mới đăng ký vào Eureka, nó sẽ tự động xuất hiện trên giao diện Admin.

* **Bước 2: Cấu hình các Service con (Clients)**
  Mọi service nghiệp vụ (`order-service`, `inventory-service`) chỉ cần thêm:
    * Dependency: `spring-boot-starter-actuator`
    * Cấu hình: Cho phép Actuator show hết thông tin ra:
  ```yaml
  management:
    endpoints:
      web:
        exposure:
          include: "*" # Mở hết tất cả "cửa sổ" để Admin Server nhìn vào
    endpoint:
      health:
        show-details: always
  ```

### 4. So sánh nhanh: Spring Boot Admin vs. Grafana

| Đặc điểm | Spring Boot Admin | Grafana + Prometheus |
| :--- | :--- | :--- |
| **Mục đích** | Quản lý, điều khiển và xem trạng thái tức thời. | Lưu trữ dữ liệu lịch sử và vẽ biểu đồ chuyên sâu. |
| **Thao tác** | Có thể tương tác (Đổi Log level, ép Restart). | Chỉ để xem (Read-only). |
| **Cài đặt** | Rất nhanh, thuần Java/Spring. | Phức tạp hơn, cần cài thêm DB (Prometheus). |
| **Phạm vi** | Chỉ dành cho Spring Boot. | Dùng được cho mọi thứ (Nodejs, MySQL...). |
