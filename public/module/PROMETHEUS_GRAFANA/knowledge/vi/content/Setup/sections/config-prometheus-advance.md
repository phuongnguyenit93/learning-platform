Nếu bạn muốn tránh việc mount file `.yml` từ máy thật vào Docker (thường gặp lỗi đường dẫn trên Windows), dưới đây là 3 cách tiếp cận chuyên nghiệp hơn.

---

### 1. Dùng "Service Discovery" qua Eureka (Hiện đại)
Thay vì ghi cứng địa chỉ, Prometheus sẽ tự động hỏi **Eureka Server** để biết danh sách các service đang chạy.

* **Cơ chế:** Prometheus gọi sang Eureka -> Eureka trả về danh sách IP/Port -> Prometheus tự động quét (scrape).
* **Lợi ích:** Bạn không bao giờ phải sửa file `.yml` khi thêm service mới. Hệ thống sẽ tự động nhận diện instance mới khi nó được đăng ký với Eureka.

### 2. Dùng Grafana Cloud (Giải pháp tiết kiệm tài nguyên)
Nếu máy bạn đang quá tải, bạn có thể đẩy dữ liệu lên **Grafana Cloud** (miễn phí cho cá nhân).

* **Cách làm:** Thêm thư viện `micrometer-registry-otlp` vào dự án Java.
* **Cơ chế:** Các service chủ động "đẩy" (Push) dữ liệu lên mây qua Internet.
* **Ưu điểm:** * Xóa bỏ Container Prometheus và Grafana cục bộ để nhẹ máy.
    * Không cần cấu hình mạng Docker phức tạp.
    * Xem biểu đồ hệ thống mọi lúc mọi nơi qua điện thoại.

---

### 3. Giải pháp "Tự chế" (Custom Docker Image)
Nếu bạn ngại việc dùng `-v` (mount volume) mỗi lần chạy lệnh CLI, hãy đóng gói file cấu hình trực tiếp vào Image.

**Bước A: Tạo `Dockerfile` trong folder prometheus:**
```dockerfile
FROM prom/prometheus
# Copy file cấu hình vào bên trong image khi build
COPY prometheus.yml /etc/prometheus/prometheus.yml
```

**Bước B: Build image của riêng bạn:**
```bash
    docker build -t my-prometheus .
```

**Bước C: Khởi chạy cực kỳ đơn giản:**
```bash
    docker run -d --name prometheus \
      --network spring-network \
      -p 9090:9090 \
      my-prometheus
```

---

### 4. Bảng so sánh các phương pháp

| Phương pháp | Độ khó | Ưu điểm | Phù hợp cho |
| :--- | :--- | :--- | :--- |
| **Static Config** | Dễ | Đơn giản, dễ hiểu. | Dự án cực nhỏ (1-2 service). |
| **Service Discovery** | Trung bình | Tự động hóa hoàn toàn, đúng chuẩn Microservices. | **Khuyên dùng cho dự án của bạn.** |
| **Custom Image** | Trung bình | Gọn gàng, không cần mount file. | Môi trường CI/CD, Deployment. |
| **Grafana Cloud** | Dễ | Tiết kiệm RAM máy cá nhân. | Máy yếu, cần giám sát từ xa. |

---
**Lời khuyên:** Với cấu trúc dự án đã có sẵn **Eureka Server**, bạn nên đi theo hướng **Service Discovery**. Nó thể hiện đúng tinh thần của Microservices: *"Các thành phần tự tìm thấy nhau, không cần can thiệp thủ công"*.
