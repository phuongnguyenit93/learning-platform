Để cấu hình API Gateway trong hệ thống Microservices, chúng ta không chỉ dừng lại ở việc khai báo Route mà còn phải tích hợp nó với **Eureka** (để tìm service) và **Config Server** (để quản lý cấu hình tập trung).

---

### Bước 1: Khai báo file build.gradle
Bạn cần các thư viện sau để Gateway có thể "nói chuyện" được với các thành phần khác trong hệ thống.

```gradle
	dependencies {
	    // 1. Cốt lõi của Gateway (Sử dụng WebFlux/Netty)
	    implementation 'org.springframework.cloud:spring-cloud-starter-gateway'

	    // 2. Client để lấy cấu hình từ Config Server
	    implementation 'org.springframework.cloud:spring-cloud-starter-config'

	    // 3. Client để đăng ký và tìm service trên Eureka
	    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'

	    // 4. Load Balancer để chia tải giữa các instance
	    implementation 'org.springframework.cloud:spring-cloud-starter-loadbalancer'

	    // 5. Actuator để Admin Server có thể giám sát
	    implementation 'org.springframework.boot:spring-boot-starter-actuator'
	}
```

---

### Bước 2: Thiết lập kết nối tới Config Server
Tại thư mục `src/main/resources/` của module `api-gateway`, tạo file `application.yml` để trỏ về "nguồn tri thức":

```yaml
	spring:
	  application:
	    name: api-gateway
	  config:
	    # Trỏ tới Config Server để lấy các route và cấu hình chi tiết
	    import: "optional:configserver:http://localhost:8888/"

	eureka:
	  client:
	    service-url:
	      defaultZone: http://localhost:8761/eureka/
```

---

### Bước 3: Tạo file cấu hình Gateway trong config-repo
Bây giờ, bạn sang thư mục `config-repo` và tạo file `api-gateway.yml`. Đây mới là nơi chứa "linh hồn" của Gateway.

```yaml
	server:
	  port: 8080

	spring:
	  cloud:
	    gateway:
	      # Tự động tạo route dựa trên tên Service Id trên Eureka
	      discovery:
	        locator:
	          enabled: true
	          lower-case-service-id: true

	      # Định nghĩa Route thủ công cho chuyên nghiệp
	      routes:
	        - id: order-service-route
	          uri: lb://order-service # lb:// là Load Balancer, hỏi Eureka để lấy IP
	          predicates:
	            - Path=/api/v1/orders/**
	          filters:
	            - StripPrefix=0

	management:
	  endpoints:
	    web:
	      exposure:
	        include: "*"
	  endpoint:
	    health:
	      show-details: always
```

---

### Bước 4: Viết Code cho Main Class
Đảm bảo bạn có các Annotation cần thiết để kích hoạt khả năng tìm kiếm service.

```java
	package com.java.learning.gateway;

	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

	@SpringBootApplication
	@EnableDiscoveryClient // Để đăng ký và tìm kiếm service trên Eureka
	public class ApiGatewayApplication {
	    public static void main(String[] args) {
	        SpringApplication.run(ApiGatewayApplication.class, args);
	    }
	}
```

---

### Bước 5: Thứ tự khởi động và Kiểm tra
Để hệ thống chạy trơn tru, hãy bật các module theo trình tự:
1.  **Discovery Server** (8761) - Đợi trạng thái ổn định.
2.  **Config Server** (8888) - Để cung cấp cấu hình cho Gateway.
3.  **API Gateway** (8080).

**Cách kiểm tra:**
* Truy cập `http://localhost:8761`: Phải thấy **API-GATEWAY** ở trạng thái **UP**.
* Truy cập `http://localhost:8888/api-gateway/default`: Phải thấy nội dung file `api-gateway.yml`.

> **Lưu ý quan trọng:** Gateway sử dụng **WebFlux (Netty)**. Nếu bạn thêm `spring-boot-starter-web` (Tomcat) vào module này, ứng dụng sẽ báo lỗi xung đột thư viện ngay lập tức.
