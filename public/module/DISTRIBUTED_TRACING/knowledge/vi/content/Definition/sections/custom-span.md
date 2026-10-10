Mặc dù các thư viện (như Spring Web, Feign, Hibernate) đã tự động tạo Span cho các sự kiện mặc định, nhưng đôi khi bạn muốn "soi" kỹ hơn vào một đoạn code xử lý phức tạp (vòng lặp nặng, thuật toán quan trọng). Lúc đó, bạn cần sử dụng **Custom Span**.

---

### Cách 1: Sử dụng `@Observed` (Khai báo - Hiện đại)
Đây là cách sạch nhất, sử dụng Annotation để bọc một phương thức lại thành một Span với tên tùy chỉnh.

**1. Cấu hình Bean (Nếu chưa có):**
```java
  @Bean
  ObservedAspect observedAspect(ObservationRegistry observationRegistry) {
      return new ObservedAspect(observationRegistry);
  }
```

**2. Sử dụng trong Service:**
```java
  @Service
  public class OrderService {

          @Observed(name = "order.processing.logic", contextualName = "calculating-discount")
          public void processOrder() {
              // Logic tính toán giảm giá sẽ hiện lên Zipkin với tên "calculating-discount"
          }
      }
```

---

### Cách 2: Sử dụng `Tracer` (Thủ công - Linh hoạt)
Dùng khi bạn muốn tạo Span cho một vài dòng code nhất định thay vì cả một phương thức.

```java
	import io.micrometer.tracing.Span;
	import io.micrometer.tracing.Tracer;
	import org.springframework.beans.factory.annotation.Autowired;

	@Service
	public class PaymentService {

	    @Autowired
	    private Tracer tracer; 

	    public void handlePayment() {
	        // 1. Tạo và bắt đầu một Span mới
	        Span newSpan = this.tracer.nextSpan().name("call-external-bank-api");

	        try (Tracer.SpanInScope ws = this.tracer.withSpan(newSpan.start())) {
	            // 2. Thêm các thông tin tùy chỉnh (Tags)
	            newSpan.tag("bank.name", "Vietcombank");

	            // Logic xử lý của bạn
	            System.out.println("Đang kết nối tới ngân hàng...");
	            Thread.sleep(500); 

	        } catch (Exception e) {
	            newSpan.error(e); // Ghi nhận lỗi nếu có
	        } finally {
	            newSpan.end(); // QUAN TRỌNG: Luôn gọi end() để gửi dữ liệu đi
	        }
	    }
	}
```

---

### Tại sao bạn nên dùng Custom Span?

* **Phân tích hiệu năng chi tiết:** Thay vì chỉ biết tổng thời gian 1s, bạn sẽ thấy rõ: `validate-user` (10ms), `calculate-tax` (800ms), `save-db` (190ms).
* **Gắn thêm dữ liệu (Tagging):** Đính kèm thông tin như `order.id`, `customer.type`. Bạn có thể tìm kiếm tất cả các Trace liên quan đến ID đó trên Zipkin.
* **Dễ đọc biểu đồ:** Các Custom Name giúp bạn hiểu ngay đoạn code đang làm gì khi nhìn vào biểu đồ "thác nước" (waterfall) mà không cần lục lại mã nguồn.

---
**Lưu ý cực kỳ quan trọng:** Khi dùng `Tracer` thủ công, hãy luôn sử dụng khối **try-finally** và gọi `.end()`. Nếu quên gọi `.end()`, dữ liệu sẽ bị "rò rỉ" và không bao giờ xuất hiện trên hệ thống giám sát.
