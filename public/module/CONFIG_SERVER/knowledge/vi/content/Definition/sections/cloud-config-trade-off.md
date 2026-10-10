### 1. Những khuyết điểm thực tế của Config Server
* **Single Point of Failure (Điểm yếu chí tử):** Nếu Config Server sập khi các service khác đang khởi động, toàn bộ hệ thống sẽ không lấy được cấu hình và không thể chạy.
* **Độ trễ khi khởi động:** Các service con phải đợi "hỏi" Config Server xong mới làm việc tiếp được.
* **Tốn tài nguyên:** Mất thêm ít nhất 200MB - 500MB RAM chỉ để chạy một ông "phục vụ cấu hình".
* **Quản lý vòng đời:** Bạn phải đảm bảo Config Server luôn sống trước khi các service khác ngoi lên (vấn đề `depends_on` trong Docker).

### 2. Vậy tại sao người ta vẫn dùng?
Hãy tưởng tượng khi hệ thống của bạn mở rộng lên đến 50 services:

* **Cách dùng Gradle/File tĩnh:** Bạn phải vào 50 chỗ để sửa, build 50 lần, deploy 50 lần. Rủi ro sai sót (human error) là cực cao.
* **Cách dùng Config Server:** Bạn sửa 1 chỗ trên Git. Toàn bộ 50 service nhận diện thay đổi.

> **Sự thật là:** Khi hệ thống chỉ có 2-3 service (như dự án `java-learning`), Config Server có vẻ hơi "overkill". Nhưng từ 5 service trở lên, nó trở thành cứu cánh.

### 3. Các phương án thay thế (Lightweight)
Nếu bạn thấy việc tạo thêm 1 Java Service chỉ để giữ cấu hình là quá lãng phí, giới công nghệ có các lựa chọn khác:

* **Environment Variables (Docker/K8s):** Truyền cấu hình qua biến môi trường. Đơn giản, không cần server riêng, nhưng khó quản lý khi số lượng biến quá lớn.
* **Consul hoặc Etcd:** Công cụ chuyên biệt để quản lý cấu hình và Service Discovery. Nhẹ hơn Spring Boot vì viết bằng ngôn ngữ Go.
* **Cloud Native (AWS AppConfig, Azure App Configuration):** Sử dụng dịch vụ có sẵn của nhà cung cấp Cloud, không cần tự code server.

### 4. Giải pháp thực tế cho dự án của bạn
Vì bạn đang học để nắm vững Spring Cloud, tôi khuyên bạn vẫn nên làm Config Server để hiểu cơ chế. Sau đó có thể tối ưu bằng cách:

1.  **Gộp chung:** Trong dự án nhỏ, có thể tích hợp Config Server vào chung với Eureka Server để tiết kiệm tài nguyên (dù không khuyến khích trong thực tế).
2.  **Dùng Profile:** Khi code ở Local, dùng file `application.yml` nội bộ. Chỉ khi chạy Docker mới kích hoạt lấy cấu hình từ Config Server.

---
**Một mẹo nhỏ:** Trong Microservices, đừng sợ tạo thêm service. Hãy sợ việc các service bị "dính chặt" (tightly coupled) vào nhau.
