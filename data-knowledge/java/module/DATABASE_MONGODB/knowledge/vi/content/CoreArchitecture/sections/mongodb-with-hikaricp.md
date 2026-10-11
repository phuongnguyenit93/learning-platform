* **Bộ quản lý kết nối bản sắc (Internal Connection Pool):** MongoDB Java Driver (thư viện lõi mà Spring Data MongoDB sử dụng) đã tích hợp sẵn một bộ quản lý kết nối cực kỳ mạnh mẽ.
* **Sự khác biệt về giao thức:** * **HikariCP** được thiết kế riêng cho **JDBC** (Java Database Connectivity) – chuẩn kết nối đồng bộ dành cho SQL.
  * **MongoDB** sử dụng giao thức truyền tải nhị phân riêng và hỗ trợ các hoạt động **Bất đồng bộ (Async)**, nên nó cần một bộ Pool riêng để tối ưu hiệu suất đặc thù.

## 2. Cách MongoDB quản lý Connection trong Spring Boot

Thay vì cấu hình qua nhánh `hikari`, bạn sẽ tinh chỉnh trực tiếp trong `spring.data.mongodb`. Các thông số này có vai trò tương đương nhưng thuộc về Driver của Mongo:

```yaml
	spring:
	  data:
	    mongodb:
	      uri: mongodb+srv://<user>:<pass>@cluster.mongodb.net/database
	      # Các thông số Pool tương đương với Hikari:
	      additional-settings:
	        # Tương đương maximum-pool-size của Hikari
	        max-connection-pool-size: 100 
	        # Tương đương minimum-idle của Hikari
	        min-connection-pool-size: 10  
	        # Thời gian chờ để lấy một kết nối từ pool (ms)
	        max-wait-time: 120000         
```

## 📊 So sánh nhanh để ghi nhớ

| Đặc điểm | RDBMS (MySQL/PostgreSQL) | MongoDB |
| :--- | :--- | :--- |
| **Thư viện kết nối** | JDBC Driver | MongoDB Java Driver |
| **Connection Pool** | **HikariCP** (Thư viện bên ngoài) | **Internal Pool** (Tích hợp sẵn) |
| **Cấu hình Spring** | `spring.datasource.hikari.*` | `spring.data.mongodb.*` |
| **Cơ chế xử lý** | Chặn (Blocking/Synchronous) | Hỗ trợ cả Chặn và Bất đồng bộ (Reactive) |

---

### 💡 Lưu ý cho Backend Developer:
Mặc dù không dùng HikariCP, nhưng triết lý tối ưu hóa vẫn giống nhau:
1.  **Đừng đặt `max-connection-pool-size` quá lớn** nếu Database server của bạn không đủ mạnh (CPU/RAM).
2.  Nếu bạn đang dùng **Spring WebFlux** (Lập trình phản ứng), hãy đảm bảo sử dụng `spring-boot-starter-data-mongodb-reactive` để tận dụng tối đa khả năng Non-blocking của bộ Pool này.

```java
    // Ví dụ kiểm tra trạng thái Pool trong Code (nếu cần)
    MongoClient mongoClient = MongoClients.create(uri);
    // Driver sẽ tự động quản lý việc mượn/trả kết nối ngầm định
```
