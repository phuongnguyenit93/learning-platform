Resilience4j chính là **Circuit Breaker** giúp hệ thống của bạn không bị sụp đổ dây chuyền. Nếu một service con bị chậm hoặc lỗi, Resilience4j sẽ đứng ra bảo vệ các service còn lại, giống như cầu chì tự ngắt để bảo vệ cả ngôi nhà khi có thiết bị bị chập điện.

### 1. 3 Trạng thái cốt lõi của Circuit Breaker
Resilience4j quản lý các lời gọi service qua 3 trạng thái:

* **CLOSED (Đóng):** Trạng thái bình thường. Mọi request đều được cho qua. Resilience4j theo dõi tỉ lệ lỗi trong giai đoạn này.
* **OPEN (Mở):** Khi tỉ lệ lỗi vượt ngưỡng (ví dụ > 50%), mạch sẽ "ngắt". Mọi request sẽ bị chặn lại ngay lập tức và trả về thông báo lỗi hoặc chạy vào hàm dự phòng (**Fallback**). Điều này giúp service đang lỗi có thời gian để hồi phục.
* **HALF-OPEN (Mở một nửa):** Sau một khoảng thời gian chờ, mạch cho phép một vài request đi qua để "thăm dò". Nếu thành công, mạch đóng lại (**CLOSED**). Nếu vẫn lỗi, mạch quay lại trạng thái **OPEN**.

### 2. Các "vũ khí" hỗ trợ khác
Ngoài Circuit Breaker, thư viện này còn cung cấp:

* **Retry (Thử lại):** Tự động gọi lại request nếu thất bại (hữu ích khi mạng chập chờn).
* **Rate Limiter (Chặn dòng):** Giới hạn số lượng request trong một khoảng thời gian để tránh bị spam.
* **Time Limiter (Giới hạn thời gian):** Tự ngắt nếu service phản hồi quá lâu, giúp giải phóng Thread (quan trọng khi dùng Virtual Threads).
* **Bulkhead (Ngăn khoang):** Chia Thread pool riêng cho từng service. Nếu Service A bị treo, nó chỉ chiếm dụng tài nguyên của "khoang" đó, không ảnh hưởng đến Service B.

### 3. Cách triển khai trong Spring Boot
Giả sử từ `order-service` gọi sang `inventory-service`. Nếu kho hàng sập, chúng ta sẽ trả về thông báo mặc định.

**Cấu hình trong `application.yml`:**

```yaml
	resilience4j:
	  circuitbreaker:
	    instances:
	      inventoryService:
	        failure-rate-threshold: 50 # Ngắt mạch nếu > 50% lỗi
	        wait-duration-in-open-state: 10s # Đợi 10 giây trước khi thử lại
```

**Sử dụng trong Code Java:**

```java
	@CircuitBreaker(name = "inventoryService", fallbackMethod = "fallbackInventory")
	public String callInventory() {
	    // Logic gọi sang service khác qua RestTemplate hoặc Feign
	    return restTemplate.getForObject("http://inventory-service/check", String.class);
	}

	// Hàm dự phòng khi mạch ngắt hoặc service kia sập
	public String fallbackInventory(Exception e) {
	    return "Kho hàng hiện tại không phản hồi, vui lòng thử lại sau!";
	}
```

### 4. Giải quyết nỗi lo "Sập hệ thống"
Quay lại vấn đề Config Server hoặc các service con bị sập:

1.  **Kết hợp Retry:** Khi khởi động, service con không "chết" ngay mà sẽ thử gọi lại Config Server nhiều lần theo cấu hình.
2.  **Trải nghiệm người dùng:** Khi một service sập
