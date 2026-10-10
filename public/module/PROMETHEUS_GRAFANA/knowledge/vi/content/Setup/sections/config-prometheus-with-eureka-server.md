Đây là lựa chọn chuyên nghiệp và đúng chất Microservices nhất. Với cách này, bạn chỉ cần cấu hình Prometheus một lần duy nhất, sau đó bất kỳ Service nào đăng ký vào Eureka sẽ tự động được Prometheus tìm thấy và thu thập dữ liệu.

---

### Bước 1: Chuẩn bị Prometheus Configuration (prometheus.yml)
Thay vì ghi cứng IP/Port, bạn sẽ bảo Prometheus "hỏi" Eureka. Hãy tạo file này tại đường dẫn dự án của bạn:

	```yaml
	global:
	  scrape_interval: 15s

	scrape_configs:
	  - job_name: 'eureka-discovery'
	    metrics_path: '/actuator/prometheus'
	    eureka_sd_configs:
	      - server: http://eureka-server:8761/eureka  # Tên container của Eureka Server
	    relabel_configs:
	      # Lọc và đổi tên hiển thị dựa trên tên ứng dụng trong Eureka
	      - source_labels: [__meta_eureka_app_name]
	        target_label: application
	```

---

### Bước 2: Build Custom Image (Né việc mount file)
Để đảm bảo tính ổn định khi chạy CLI, chúng ta đóng gói file config vào một Image riêng. Tại thư mục chứa file `.yml` trên, tạo file `Dockerfile`:

	```dockerfile
	FROM prom/prometheus:latest
	COPY prometheus.yml /etc/prometheus/prometheus.yml
	```

**Mở Terminal tại thư mục đó và chạy lệnh build:**
```bash
docker build -t my-prometheus-eureka .
```

---

### Bước 3: Khởi chạy bằng Docker CLI
Sử dụng các lệnh sau để "hợp nhất" hệ thống giám sát vào mạng chung của dự án:

**1. Chạy Prometheus (Image vừa build):**
```bash
docker run -d \
  --name prometheus \
  --network java-network \
  -p 9090:9090 \
  my-prometheus-eureka
```

**2. Chạy Grafana:**
```bash
docker run -d \
  --name grafana \
  --network java-network \
  -p 3000:3000 \
  -e "GF_SECURITY_ADMIN_PASSWORD=admin" \
  grafana/grafana
```

---

### Bước 4: Kiểm tra thành quả

* **Kiểm tra Prometheus:** Truy cập `localhost:9090`. Vào mục **Status -> Service Discovery**. Bạn sẽ thấy các service như `ORDER-SERVICE`, `PAYMENT-SERVICE` xuất hiện tự động.
* **Kiểm tra Grafana:** Truy cập `localhost:3000`, kết nối Data Source tới `http://prometheus:9090` và Import Dashboard **ID: 11378**.

---
**Ưu điểm vượt trội:** Với cấu hình này, khi bạn scale thêm instance hoặc thêm một Microservice hoàn toàn mới, Prometheus sẽ tự động "nhận diện" ngay lập tức mà không cần bạn phải khởi động lại hay chỉnh sửa bất kỳ file cấu hình nào.
