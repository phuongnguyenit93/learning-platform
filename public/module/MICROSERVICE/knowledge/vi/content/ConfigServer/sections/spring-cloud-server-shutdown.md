Bạn đã chỉ ra "tử huyệt" lớn nhất của mô hình cấu hình tập trung. Trong kỹ thuật, lỗi này được gọi là **Single Point of Failure (SPOF)** — một mắt xích duy nhất bị hỏng có thể kéo sập cả tòa nhà.

Tuy nhiên, trong thực tế triển khai Microservices, người ta sử dụng 3 "tấm khiên" bảo vệ sau để đảm bảo hệ thống vẫn sống sót:

## 1. Cơ chế Cấu hình Ngoại tuyến (Fail-fast & Local Overrides)
Khi một service con (Client) khởi động, nó sẽ thử gọi lên Config Server. Nếu không gọi được:
* **Fail-fast:** Service sẽ sập ngay lập tức. Điều này giúp phát hiện lỗi hệ thống sớm ngay khi deploy thay vì chạy với cấu hình sai.
* **Cơ chế dự phòng:** Bạn có thể để sẵn một file `application.yml` cơ bản bên trong chính service đó. Nếu Config Server không phản hồi, nó sẽ dùng cấu hình "sơ cua" này để duy trì hoạt động tối thiểu.

## 2. Bộ nhớ đệm (Caching / Local Copy)
Đây là cách bảo vệ phổ biến nhất:
* **Bản sao nội bộ:** Một khi service đã lấy được cấu hình lần đầu, nó sẽ lưu bản sao đó vào bộ nhớ.
* **Trạng thái chạy:** Nếu Config Server sập sau khi các service khác đã khởi động xong, hệ thống vẫn hoạt động bình thường vì chúng đã "cầm sẵn" cấu hình trong tay. Nó chỉ trở thành vấn đề khi bạn cần **Restart** service hoặc **Scale** thêm instance mới.

## 3. Khả năng sẵn sàng cao (High Availability - HA)
Trong môi trường Production, người ta không bao giờ chạy một Config Server duy nhất:

* **Chạy cụm (Cluster):** Chạy 2-3 instance Config Server cùng lúc.
* **Load Balancer:** Đặt một bộ cân bằng tải đứng trước. Nếu Server 1 sập, Load Balancer tự động chuyển request sang Server 2.
* **Git Backend:** Vì Config Server lấy dữ liệu từ Git, nên bản thân nền tảng Git (như GitHub/GitLab) cũng là một hệ thống cực kỳ khó sập.

---

## 📊 Tổng kết tình huống cho dự án java-learning

| Tình huống | Kết quả | Giải pháp kỹ thuật |
| :--- | :--- | :--- |
| **Sập khi đang chạy** | Không ảnh hưởng ngay lập tức. | Không cần quá lo, chỉ lo khi cần update cấu hình gấp. |
| **Sập khi khởi động** | Service con không lên được. | Dùng `spring.cloud.config.fail-fast=true` kết hợp với cơ chế **Retry** (thử lại sau mỗi 5s). |

```yaml
	# Cấu hình Retry và Fail-fast trong client (bootstrap.yml)
	spring:
	  cloud:
	    config:
	      fail-fast: true # Sập luôn nếu không thấy Config Server
	      retry:
	        initial-interval: 2000 # Thử lại sau 2s
	        max-attempts: 6 # Thử tối đa 6 lần
```

---

### 💡 Lời khuyên:
Trong dự án `java-learning`, bạn hãy cài đặt thêm thư viện `spring-retry` và `spring-boot-starter-aop`. Khi đó, service con của bạn sẽ trở nên "
