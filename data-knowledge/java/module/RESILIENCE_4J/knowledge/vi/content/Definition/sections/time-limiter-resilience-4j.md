Trong Resilience4j, việc thiết lập giới hạn thời gian chờ (timeout) thường được xử lý thông qua module **TimeLimiter**. Đây là cơ chế giúp ngăn chặn việc một luồng (thread) bị treo quá lâu khi gọi một service bên ngoài không phản hồi.

### 1. Cấu hình qua file application.yml
Đây là cách phổ biến và dễ quản lý nhất. Bạn có thể định nghĩa các giá trị mặc định hoặc cấu hình riêng cho từng instance.

```yaml
	resilience4j:
	  timelimiter:
	    instances:
	      backendService:
		timeout-duration: 2s # Giới hạn thời gian chờ là 2 giây
		cancel-running-future: true # Hủy thực thi nếu quá thời gian
```

* **timeout-duration:** Khoảng thời gian tối đa để hoàn thành request.
* **cancel-running-future:** Nếu đặt là `true`, khi hết thời gian, Resilience4j sẽ cố gắng ngắt quãng luồng đang chạy.

### 2. Cấu hình bằng Code (Java Config)
Nếu bạn muốn tùy chỉnh linh hoạt hơn, bạn có thể tạo một `TimeLimiterConfig`:

	```java
	TimeLimiterConfig config = TimeLimiterConfig.custom()
	    .timeoutDuration(Duration.ofSeconds(2))
	    .cancelRunningFuture(true)
	    .build();

	TimeLimiterRegistry registry = TimeLimiterRegistry.of(config);
	TimeLimiter timeLimiter = registry.timeLimiter("backendService");
	```

### 3. Cách sử dụng trong Service
Sử dụng annotation `@TimeLimiter` để áp dụng cấu hình.

> **Lưu ý:** `@TimeLimiter` hoạt động tốt nhất với các phương thức trả về kiểu không đồng bộ như `CompletableFuture` hoặc các kiểu Reactive (`Mono`, `Flux`).

```java
	@Service
	public class MyService {

	    @TimeLimiter(name = "backendService", fallbackMethod = "fallback")
	    public CompletableFuture<String> doSomething() {
		return CompletableFuture.supplyAsync(() -> {
		    // Giả lập xử lý nặng
		    try { Thread.sleep(3000); } catch (InterruptedException e) {}
		    return "Thành công!";
		});
	    }

	    public CompletableFuture<String> fallback(Throwable t) {
		return CompletableFuture.completedFuture("Hệ thống phản hồi chậm, vui lòng thử lại sau!");
	    }
	}
```

---

### Một số lưu ý quan trọng

* **Kết hợp với Circuit Breaker:** Thông thường, `@TimeLimiter` hay được dùng cùng `@CircuitBreaker`. Nếu timeout xảy ra liên tục, Circuit Breaker sẽ chuyển sang trạng thái **OPEN** để bảo vệ hệ thống.
* **Cấu hình HTTP Client:** Các thư viện như `RestTemplate` hay `WebClient` cũng có cấu hình timeout riêng. Bạn nên để timeout của Client lớn hơn hoặc bằng với `TimeLimiter` để tránh xung đột.
* **Quản lý Thread Pool:** Khi dùng `CompletableFuture`, hãy đảm bảo quản lý Thread Pool hợp lý để tránh tình trạng cạn kiệt tài nguyên (Thread exhaustion) khi có quá nhiều request bị timeout đồng thời.
