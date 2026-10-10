Đây chính là "phép thuật" thực sự của Spring Cloud Config. Việc điều chỉnh cấu hình diễn ra theo một quy trình 3 bước: **Sửa file -> Config Server nhận diện -> Client làm mới (Refresh)**.

### 1. Cách thủ công: Sửa file trong config-repo
Vì bạn đang dùng chế độ `native` (thư mục cục bộ), cách đơn giản nhất là:

1.  Mở thư mục `config-repo` trên máy tính.
2.  Mở file `order-service.yml`.
3.  Thay đổi giá trị (ví dụ: đổi `timeout: 1000` thành `timeout: 5000`) và Lưu file.

> **Lưu ý:** Lúc này Config Server đã có giá trị mới, nhưng `order-service` (Client) vẫn đang giữ giá trị cũ trong RAM. Bạn cần thực hiện bước "Refresh".

---

### 2. Cách "Phù thủy": Refresh không cần khởi động lại
Để ứng dụng cập nhật giá trị mới mà không phải tắt đi bật lại, bạn cần sử dụng Spring Boot Actuator.

**Bước A: Thêm `@RefreshScope` vào Code**
Trong các Class Java dùng `@Value` hoặc `@ConfigurationProperties`, bạn phải thêm annotation này:

```java
	@RestController
	@RefreshScope // <--- Quan trọng nhất: Đánh dấu Bean này có thể nạp lại dữ liệu
	public class OrderController {
	    @Value("${message}")
	    private String message;
	}
```

**Bước B: Gọi Endpoint `/refresh`**
Bạn phải "nhắc" service con bằng cách gửi một request POST (dùng Postman hoặc cURL):

* **URL:** `http://localhost:8081/actuator/refresh` (Port của service con)
* **Method:** `POST`
* **Body:** Trống.

---

### 3. Cách tự động hóa: Dùng Spring Cloud Bus (Nâng cao)
Nếu bạn có hàng trăm instance đang chạy, việc gọi lệnh POST thủ công là bất khả thi. Giải pháp là dùng **Spring Cloud Bus** kết hợp với **RabbitMQ** hoặc **Kafka**.

1.  Bạn sửa file cấu hình.
2.  Gọi duy nhất 1 lần tới Config Server: `POST http://localhost:8888/actuator/bus-refresh`.
3.  Config Server gửi một "thông điệp" qua Message Broker tới tất cả các service con.
4.  Toàn bộ các service sẽ tự động đồng loạt làm mới cấu hình.

---

### 4. Quản lý qua Giao diện (Spring Boot Admin)
Vì bạn đã dựng **Admin Server**, bạn có thể điều chỉnh trực tiếp tại đó:

1.  Vào Dashboard `http://localhost:9090`.
2.  Chọn service cần cập nhật (ví dụ: `order-service`).
3.  Tìm mục **Configuration** hoặc **Environment**.
4.  Bạn có thể xem các thuộc tính đang chạy và kích hoạt lệnh **Refresh** ngay trên giao diện web.

---
**Tóm lại:** * **Sửa trên RAM:** Dùng JMX/Hawtio (Mất khi restart).
* **Sửa vĩnh viễn:** Sửa file ở Config Repo + Gọi `/refresh` (Bền vững).
