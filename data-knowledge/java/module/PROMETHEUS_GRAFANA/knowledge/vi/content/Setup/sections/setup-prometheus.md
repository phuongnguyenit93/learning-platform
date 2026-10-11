Để thiết lập hệ thống giám sát vào cấu trúc dự án hiện tại, chúng ta sẽ thực hiện qua 3 giai đoạn: Cấu hình Java (xuất dữ liệu), Cấu hình Prometheus (thu thập) và triển khai Docker.

---

### Bước 1: Cấu hình trong các module Java (Service)
Bạn cần thêm thư viện để Spring Boot có thể "phơi" dữ liệu (metrics) ra cho Prometheus đọc. Thực hiện trên các service như `order-service`, `payment-service`...

**1.1. Thêm Dependency (Gradle):**
	```gradle
	implementation 'org.springframework.boot:spring-boot-starter-actuator'
	implementation 'io.micrometer:micrometer-registry-prometheus'
	```

**1.2. Cấu hình `application.yml`:**
Bật endpoint prometheus để dữ liệu có thể truy cập được từ bên ngoài:
	```yaml
	management:
	  endpoints:
	    web:
	      exposure:
	        include: prometheus, health, info
	  metrics:
	    tags:
	      application: ${spring.application.name} # Gắn tag để lọc trên Grafana
	```

---

### Bước 2: Cấu hình Prometheus (Thủ kho)
Trong thư mục `deployments/docker/prometheus`, tạo file `prometheus.yml` để định nghĩa các mục tiêu cần quét dữ liệu:

```yaml
	global:
	  scrape_interval: 15s # Chu kỳ quét dữ liệu (15 giây/lần)

	scrape_configs:
	  - job_name: 'spring-boot-services'
	    metrics_path: '/actuator/prometheus'
	    static_configs:
	      - targets: 
	          - 'order-service:8081'
	          - 'payment-service:8082'
	          - 'inventory-service:8083'
```

---

### Bước 3: Cấu hình Docker Compose
Cập nhật file `docker-compose.yml` tại folder `deployments/docker` để chạy cụm Monitoring:

```yaml
	services:
	  prometheus:
	    image: prom/prometheus:latest
	    container_name: prometheus
	    volumes:
	      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
	    ports:
	      - "9090:9090"
	    networks:
	      - spring-network

	  grafana:
	    image: grafana/grafana:latest
	    container_name: grafana
	    ports:
	      - "3000:3000"
	    environment:
	      - GF_SECURITY_ADMIN_PASSWORD=admin
	    networks:
	      - spring-network
	    depends_on:
	      - prometheus

	networks:
	  spring-network:
	    driver: bridge
```

---

### Bước 4: Kết nối và Hiển thị trên Grafana

1.  **Truy cập Grafana:** Mở `localhost:3000` (User/Pass: `admin`/`admin`).
2.  **Add Data Source:**
    * Chọn **Connections** -> **Data Sources** -> **Prometheus**.
    * Tại ô URL, nhập: `http://prometheus:9090`.
    * Nhấn **Save & Test**.
3.  **Import Dashboard (Khuyên dùng):**
    * Chọn **Dashboards** -> **New** -> **Import**.
    * Nhập ID: `11378` (Mẫu JVM Micrometer chuẩn cho Spring Boot).
    * Chọn nguồn dữ liệu Prometheus vừa tạo và nhấn **Import**.

---

### Kết quả đạt được
Sau khi cấu hình, bạn sẽ quan sát được các chỉ số thời gian thực:
* **Hiệu năng:** Biểu đồ CPU/RAM của từng service.
* **Độ tin cậy:** Tỉ lệ request thành công/thất bại (HTTP 200 vs 500).
* **JVM Health:** Trạng thái bộ nhớ Heap, giúp phát hiện sớm các lỗi Memory Leak.
