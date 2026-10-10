Để minh họa sức mạnh của Resilience4j trong việc bảo vệ hệ thống (đặc biệt khi bạn đang làm việc với Virtual Threads và Database trong dự án `java-learning`), chúng ta sẽ thiết lập một bộ "phanh" cho hệ thống.

Dưới đây là cách kết hợp **Bulkhead** (Ngăn khoang) và **Retry** (Thử lại) để tránh làm "cháy" Database khi có quá nhiều request cùng lúc.

### 1. Cấu hình trong application.yml
Giả sử bạn có một logic truy vấn Database nặng. Bạn không muốn quá 5 Virtual Threads cùng đâm vào DB này một lúc để tránh treo kết nối.

	```yaml
	resilience4j:
	  bulkhead:
	    instances:
	      dbOperation:
	        max-concurrent-calls: 5 # Tối đa 5 luồng chạy cùng lúc
	        max-wait-duration: 500ms # Nếu luồng thứ 6 đến, bắt nó đợi 0.5s, quá 0.5s thì báo lỗi ngay

	  retry:
	    instances:
	      dbOperation:
	        max-attempts: 3 # Nếu lỗi (do mạng hoặc DB bận), thử lại tối đa 3 lần
	        wait-duration: 2s # Mỗi lần thử lại cách nhau 2 giây
	```

### 2. Triển khai trong Code (Service Layer)
Bạn chỉ cần bọc các Annotation này đè lên phương thức xử lý logic:

	```java
	@Service
	public class OrderService {

	    @Bulkhead(name = "dbOperation", fallbackMethod = "handleBulkheadFull")
	    @Retry(name = "dbOperation")
	    public String processLargeOrder(Long orderId) {
	        // Giả sử đây là logic gọi Database hoặc Thread nặng
	        System.out.println("Đang xử lý đơn hàng: " + orderId + " bằng " + Thread.currentThread());
	        return "Đơn hàng " + orderId + " đã xử lý thành công!";
	    }

	    // Hàm này chạy khi có quá nhiều người cùng vào (Bulkhead đầy)
	    public String handleBulkheadFull(Long orderId, Exception e) {
	        return "Hệ thống đang quá tải, đơn hàng " + orderId + " sẽ được xử lý sau ít phút.";
	    }
	}
	```

### 3. Tại sao cái này "hỗ trợ" cực tốt cho bạn?

* **Chống tràn Thread:** Vì bạn đang học về **Java 21 Virtual Threads**, đặc điểm của chúng là tạo ra hàng triệu luồng rất dễ dàng. Nếu không dùng Bulkhead, hàng triệu luồng đó sẽ cùng lúc "tấn công" Database, khiến hệ thống sập ngay lập tức.
* **Tăng độ tin cậy:** Nếu Config Server hoặc một Service khác bị khởi động chậm, cơ chế **Retry** sẽ giúp ứng dụng tự "kiên nhẫn" thử lại thay vì trả về lỗi 500 ngay lập tức.
* **Quan sát (Observability):** Resilience4j tích hợp rất tốt với **Micrometer và Grafana**. Bạn có thể vẽ biểu đồ xem mạch đang Đóng hay Mở, tỉ lệ lỗi là bao nhiêu ngay trên Dashboard.
