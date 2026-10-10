Đây là cách tiếp cận chuyên nghiệp nhất dành cho dân làm Spring Boot. Thay vì dùng các lệnh Docker bên ngoài, bạn sẽ tích hợp Arthas trực tiếp vào vòng đời của ứng dụng.

## 1. Cơ chế hoạt động của "Starter"
Khi bạn thêm dependency vào `pom.xml`, Spring Boot sẽ tự động kích hoạt một con Agent ngầm khi ứng dụng khởi chạy.

* **Không cần file JAR rời:** Bạn không cần tải hay lưu trữ `arthas-boot.jar` bên ngoài nữa.
* **Tự động báo danh:** App sẽ chủ động kết nối về Tunnel Server dựa trên cấu hình có sẵn trong file YAML.

## 2. Cách cấu hình (Cực kỳ đơn giản)

**Bước 1: Thêm Dependency vào `pom.xml`**
```xml
   <dependency>
       <groupId>com.taobao.arthas</groupId>
       <artifactId>arthas-spring-boot-starter</artifactId>
       <version>3.7.1</version>
   </dependency>
```

**Bước 2: Cấu hình trong `application.yml`**
```yaml
   arthas:
     # Địa chỉ Tunnel Server (Trạm trung tâm)
     tunnel-server: ws://host.docker.internal:7777/ws
     # Tên định danh duy nhất cho Service này trên giao diện Web
     agent-id: inventory-service
     # Các cổng giao tiếp mặc định (nếu muốn đổi)
     telnet-port: 3658
     http-port: 8563
```

## 3. Tại sao cách này lại "xịn" hơn?

* **Tự động hóa 100%:** Chỉ cần `docker-compose up`, tất cả Service sẽ tự động xuất hiện trên Web Console của Arthas Tunnel.
* **Phù hợp với Cloud/K8s:** Bạn không cần biết Container ID hay IP cụ thể. Dù có 100 bản sao (Replicas) đang chạy, chúng sẽ tự động đổ về bảng danh sách tập trung.
* **Quản lý tập trung:** Dễ dàng kết hợp với **Spring Cloud Config** để bật/tắt Arthas trên toàn hệ thống chỉ bằng một thay đổi nhỏ ở file cấu hình trung tâm.

## 4. Một vài lưu ý "sống còn" về bảo mật

Vì việc nhúng trực tiếp giúp truy cập vào "nội tạng" của App rất dễ dàng, bạn cần đặc biệt chú ý:

1. **Môi trường Production:** Tuyệt đối không bật starter này trên Production nếu không có tường lửa (Firewall) bảo vệ nghiêm ngặt các cổng `7777` và `8080`.
2. **Tài nguyên:** Nó sẽ chiếm thêm khoảng **20MB - 50MB RAM** để duy trì Agent ngầm. Hãy đảm bảo giới hạn RAM (Memory Limit) của Container đủ cho phần dôi dư này.
3. **Môi trường Local:** Cấu hình `enabled: true` nên được đặt trong file `application-dev.yml` để tránh việc vô tình kích hoạt ở các môi trường không mong muốn.

---

### 💡 Mẹo nhỏ cho dự án java-learning:
Nếu bạn muốn tạm thời tắt Arthas mà không muốn xóa code/dependency, chỉ cần thêm dòng này vào config:
```yaml
   arthas:
     enabled: false
```
