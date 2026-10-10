Việc lựa chọn giữa **Monolith** và **Microservices** giống như việc chọn giữa một chiếc xe bus đường dài và một đội xe taxi. Cả hai đều có mục đích di chuyển, nhưng cách vận hành và chi phí lại hoàn toàn khác biệt.

[Image of Monolithic vs Microservices architecture diagram]

## 1. Kiến trúc Monolith (Đơn khối)
Toàn bộ mã nguồn (UI, Business Logic, Data Access) được đóng gói và triển khai thành một đơn vị duy nhất.

### ✅ Ưu điểm
* **Đơn giản giai đoạn đầu:** Dễ phát triển, kiểm thử và triển khai (chỉ cần 1 file `.war` hoặc `.jar`).
* **Hiệu suất cao:** Các lời gọi hàm diễn ra trong cùng một bộ nhớ (in-memory), không có độ trễ mạng.
* **Chi phí thấp:** Chỉ cần quản lý một hạ tầng, một pipeline CI/CD và một database duy nhất.

### ❌ Nhược điểm
* **Khó mở rộng (Scalability):** Muốn scale một module bị quá tải, bạn phải nhân bản toàn bộ ứng dụng, gây lãng phí tài nguyên.
* **Độ phức tạp tăng dần:** Codebase lớn khiến việc bảo trì khó khăn. Một lỗi nhỏ có thể làm sập toàn bộ hệ thống.
* **Rào cản công nghệ:** Rất khó để thay đổi stack công nghệ vì mọi thứ đã gắn chặt với nhau.

---

## 2. Kiến trúc Microservices (Vi-dịch vụ)
Ứng dụng được chia thành các dịch vụ nhỏ, độc lập, liên lạc với nhau qua mạng (REST, gRPC, Message Broker).

### ✅ Ưu điểm
* **Mở rộng linh hoạt:** Scale riêng lẻ dịch vụ đang chịu tải cao mà không ảnh hưởng phần còn lại.
* **Độc lập triển khai:** Các team có thể deploy dịch vụ của mình mà không cần chờ đợi lẫn nhau.
* **Khả năng chịu lỗi (Fault Tolerance):** Nếu dịch vụ "Gợi ý" bị lỗi, người dùng vẫn có thể "Mua hàng" bình thường.

### ❌ Nhược điểm
* **Độ phức tạp cực cao:** Thử thách lớn trong việc quản lý giao tiếp, bảo mật và đồng nhất dữ liệu (**Distributed Transactions**).
* **Chi phí vận hành:** Đòi hỏi đầu tư mạnh vào DevOps, Monitoring (Prometheus, Grafana) và Kubernetes.
* **Độ trễ mạng:** Việc gọi qua lại giữa các service tạo ra độ trễ (latency), cần thiết kế tối ưu.

---

## 📊 Bảng so sánh trực quan

| Tiêu chí | Monolith | Microservices |
| :--- | :--- | :--- |
| **Độ phức tạp** | Thấp (Lúc đầu) | Cao (Ngay từ đầu) |
| **Triển khai** | Dễ (Một khối duy nhất) | Khó (Cần CI/CD tự động hóa cao) |
| **Scalability** | Theo chiều dọc (Vertical) | Theo chiều ngang (Horizontal) |
| **Chi phí ban đầu** | Thấp | Cao (Infrastructure & Nhân sự) |
| **Công nghệ** | Bị giới hạn trong một stack | Tự do chọn ngôn ngữ/DB cho từng service |

---

## 🚀 Khi nào nên chọn cái nào?

### Chọn Monolith khi:
* Dự án đang ở giai đoạn khởi nghiệp (**MVP**) cần tốc độ ra mắt nhanh.
* Đội ngũ phát triển nhỏ (dưới 10 người).
* Ứng dụng không có yêu cầu quá cao về tải hoặc tính sẵn sàng cực đoan.

### Chọn Microservices khi:
* Hệ thống có quy mô rất lớn và độ phức tạp nghiệp vụ cao.
* Có nhiều đội ngũ phát triển làm việc song song (ví dụ: Team Order, Team Payment).
* Cần tối ưu chi phí hạ tầng về lâu dài thông qua việc mở rộng từng phần.

```bash
  # Ví dụ tư duy triển khai Monolith (Đơn giản)
  java -jar monolith-app.jar

  # Ví dụ tư duy triển khai Microservices (Phức tạp hơn)
  docker-compose up -d discovery-server gateway-service order-service payment-service
```
