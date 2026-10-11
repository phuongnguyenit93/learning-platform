Ba trạng thái này chính là "linh hồn" của mô hình Circuit Breaker. Nó hoạt động y hệt như cái cầu dao điện trong nhà bạn: Khi có chập điện (lỗi hệ thống), cầu dao sẽ tự ngắt để bảo vệ các thiết bị khác không bị cháy theo.

### 1. Trạng thái CLOSED (Mạch đóng - Bình thường)
Đây là trạng thái lý tưởng nhất khi hệ thống đang hoạt động ổn định.

* **Cơ chế:** Mọi request đều được phép đi xuyên qua mạch để gọi đến Service đích.
* **Theo dõi:** Resilience4j sẽ âm thầm đếm số lượng cuộc gọi thành công và thất bại.
* **Chuyển trạng thái:** Nếu tỉ lệ lỗi (ví dụ: > 50%) vượt ngưỡng cấu hình trong một khoảng thời gian, mạch sẽ tự động "nhảy" sang trạng thái **OPEN**.

### 2. Trạng thái OPEN (Mạch ngắt - Đang có sự cố)
Lúc này, hệ thống coi như Service đích "đã chết" hoặc đang cực kỳ quá tải.

* **Cơ chế:** Mạch ngắt hoàn toàn. Mọi request gửi đến sẽ bị chặn đứng ngay lập tức (**Fast-fail**) và ném ra lỗi `CallNotPermittedException`.
* **Lợi ích:** Tránh việc người dùng phải chờ Timeout quá lâu và giúp Service đích có thời gian để "hồi sức".
* **Chuyển trạng thái:** Mạch giữ trạng thái này trong một khoảng thời gian chờ (ví dụ: 30 giây), sau đó tự chuyển sang **HALF-OPEN**.

### 3. Trạng thái HALF-OPEN (Mạch mở một nửa - Thăm dò)
Đây là trạng thái "thử nghiệm" để xem Service đích đã thực sự khỏe lại chưa.

* **Cơ chế:** Mạch cho phép một lượng nhỏ request (ví dụ: 10 cuộc gọi) đi qua.
* **Kết quả:**
  * **Nếu đa số thành công:** Hệ thống đã ổn, mạch quay về **CLOSED**.
  * **Nếu vẫn thất bại:** Lập tức quay lại **OPEN** và tiếp tục đợi thêm một chu kỳ nữa.

---

### Bảng tóm tắt nhanh

| Trạng thái | Request được đi qua? | Mục đích chính |
| :--- | :--- | :--- |
| **CLOSED** | Có (100%) | Hoạt động bình thường và theo dõi tỉ lệ lỗi. |
| **OPEN** | Không (0%) | Ngắt kết nối để bảo vệ hệ thống và báo lỗi nhanh. |
| **HALF-OPEN** | Có (Giới hạn) | Kiểm tra thực tế xem hệ thống đã hồi phục chưa. |

---

### Ví dụ cấu hình thực tế trong YAML

```yaml
	resilience4j:
	  circuitbreaker:
	    instances:
	      inventoryCB:
	        failureRateThreshold: 50       # Nếu lỗi quá 50%
	        waitDurationInOpenState: 10000 # Đợi 10 giây ở trạng thái OPEN
	        slidingWindowSize: 10          # Tính tỉ lệ dựa trên 10 cuộc gọi gần nhất
```

> **Hình tượng hóa:** Hãy tưởng tượng Circuit Breaker như một bác sĩ: **CLOSED** là đang khám bệnh bình thường; **OPEN** là đưa bệnh nhân vào phòng cấp cứu và treo biển "Miễn tiếp khách"; còn **HALF-OPEN** là hé cửa cho vài người vào xem bệnh nhân đã tỉnh hẳn chưa trước khi mở cửa đón khách lại.
