Tài liệu này hướng dẫn cách thiết lập hệ thống quản lý cấu hình tập trung cho dự án Microservices, giúp tách rời cấu hình khỏi mã nguồn và quản lý chúng dễ dàng hơn.

---

### 1. Tại sao cần Spring Cloud Config?

Trong môi trường Microservices, việc thay đổi cấu hình (như địa chỉ Database, RabbitMQ) cho hàng chục service là một cực hình. Spring Cloud Config giúp:
* **Quản lý tập trung:** Tất cả cấu hình nằm tại một nơi (Git hoặc Local Folder).
* **Thay đổi nóng:** Cập nhật cấu hình mà không cần build lại mã nguồn.
* **Bảo mật:** Hỗ trợ mã hóa các thông tin nhạy cảm.

---

### 2. Thiết lập Config Server (Ông trùm cấu hình)

Module này sẽ đóng vai trò phục vụ file cấu hình cho các service khác.

**A. Khai báo `build.gradle`:**
```gradle
dependencies {
    implementation 'org.springframework.cloud:spring-cloud-config-server'
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
}
```

**B. Main Class:**
```java
@SpringBootApplication
@EnableConfigServer
@EnableDiscoveryClient
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

**C. Cấu hình `application.yml` (Sử dụng Local File System):**
```yaml
server:
  port: 8888
spring:
  application:
    name: config-server
  profiles:
    active: native
  cloud:
    config:
      server:
        native:
          search-locations: file:/path/to/your/config-repo
```

---

### 3. Thiết lập Config Client (Service con)

Các service con sẽ "nhận cha" và tải cấu hình khi khởi động.

**A. Khai báo `build.gradle`:**
```gradle
dependencies {
    implementation 'org.springframework.cloud:spring-cloud-starter-config'
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
}
```

**B. Cấu hình `application.yml` (Trỏ về Server):**
```yaml
spring:
  application:
    name: order-service
  config:
    import: "optional:configserver:http://localhost:8888/"
```

**C. Sử dụng giá trị trong Code:**
```java
    @RestController
    @RefreshScope // Giúp cập nhật giá trị mà không cần restart service
    public class ConfigController {

            @Value("${message:Default Message}")
            private String message;

            @GetMapping("/msg")
            public String getMessage() {
                return this.message;
            }
        }
```

---

### 4. Lưu ý quan trọng về tính an toàn

1.  **Tiền tố `optional:`:** Luôn sử dụng `optional:configserver:` để đảm bảo service con vẫn khởi động được bằng cấu hình nội bộ nếu Config Server tạm thời không liên lạc được.
2.  **Thứ tự khởi động:**
    * Chạy **Discovery Server** (Eureka) trước.
    * Chạy **Config Server** tiếp theo.
    * Cuối cùng mới chạy các **Service con**.
3.  **Cấu hình Retry:** Nên bổ sung thư viện `spring-retry` để service con tự động thử lại nếu Config Server khởi động chậm hơn dự kiến.

---
