Tiếp nối `discovery-server`, chúng ta sẽ dựng **Admin Server**. Vì bạn đã cấu hình BOM (Spring Cloud Dependencies) ở file root, việc tạo module này sẽ rất nhẹ nhàng.

**Lưu ý:** Admin Server sẽ đóng vai trò là một "khách hàng" của Eureka để tự động lấy danh sách các service về.

### Bước 1: Tạo module infrastructure/admin-server

1. **Khai báo build.gradle con:**

```gradle
   plugins {
       id 'org.springframework.boot'
   }

   dependencies {
       // Thư viện Spring Boot Admin Server
       implementation 'de.codecentric:spring-boot-admin-starter-server'

       // Eureka Client để Admin tự tìm các service khác
       implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'

       // Thêm Security để bảo vệ Dashboard (khuyên dùng)
       implementation 'org.springframework.boot:spring-boot-starter-security'
   }
```

2. **Tạo Main Class:**
   Đừng quên annotation `@EnableAdminServer`.

```java
   package com.java.learning.admin;

   import de.codecentric.boot.admin.server.config.EnableAdminServer;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

   @SpringBootApplication
   @EnableAdminServer
   @EnableDiscoveryClient // Để Admin Server tìm đến Eureka lấy danh sách service
   public class AdminServerApplication {
       public static void main(String[] args) {
           SpringApplication.run(AdminServerApplication.class, args);
       }
   }
```

### Bước 2: Cấu hình application.yml
File này sẽ định nghĩa Port và cách nó kết nối với "tổng đài" Eureka.

```yaml
	server:
	  port: 9090

	spring:
	  application:
	    name: admin-server
	  security:
	    user:
	      name: admin
	      password: admin_password

	eureka:
	  client:
	    service-url:
	      defaultZone: http://localhost:8761/eureka/
	    # Admin Server cũng cần đăng ký mình lên Eureka để các service khác biết
	    register-with-eureka: true
	    fetch-registry: true
```

### Bước 3: Cấu hình Security (Quan trọng)
Vì Spring Boot Admin có giao diện web, bạn cần cấu hình để nó cho phép các service con gửi dữ liệu vào và người dùng xem được giao diện.

```java
	@Configuration
	public class SecurityConfig {
	    @Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	        http.authorizeHttpRequests(authorize -> authorize
	                .requestMatchers("/assets/**").permitAll() // Cho phép load CSS/JS
	                .requestMatchers("/login").permitAll()
	                .anyRequest().authenticated()
	            )
	            .formLogin(form -> form.loginPage("/login").permitAll())
	            .logout(logout -> logout.logoutUrl("/logout"))
	            .httpBasic(Customizer.withDefaults()) // Cho phép các service con login qua HTTP Basic
	            .csrf(csrf -> csrf.disable()); // Tắt CSRF để các service con gửi data dễ dàng

	        return http.build();
	    }
	}
```

### Bước 4: Đăng ký module vào Root
Trong file `settings.gradle` ở thư mục gốc:

	```gradle
	include 'infrastructure:admin-server'
	```

### Bước 5: Kiểm tra
1.  Chạy **Discovery Server** (Port 8761).
2.  Chạy **Admin Server** (Port 9090).
3.  Truy cập `http://localhost:9090`, đăng nhập với `admin` / `admin_password`.

**Bạn sẽ thấy gì?**
Lúc này trên Dashboard sẽ xuất hiện 2 "ông lớn" đang ở trạng thái **UP**:
* **DISCOVERY-SERVER**
* **ADMIN-SERVER**
