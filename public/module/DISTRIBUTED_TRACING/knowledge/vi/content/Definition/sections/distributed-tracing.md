Khi hệ thống chia nhỏ thành nhiều Microservices, một request từ client có thể đi qua hàng chục dịch vụ khác nhau. **Distributed Tracing** chính là công cụ giúp bạn biết chính xác request bị nghẽn hoặc lỗi ở đâu trong hành trình đó.

### 1. Các khái niệm cốt lõi (Core Concepts)
Để hiểu Distributed Tracing, bạn cần nhớ 3 thuật ngữ quan trọng nhất:

* **Trace:** Toàn bộ hành trình của một request từ đầu đến cuối. Một Trace bao gồm nhiều Span.
* **Span:** Đơn vị công việc nhỏ nhất (ví dụ: một lần gọi API, một lần truy vấn Database). Mỗi Span có ID, tên và thời gian thực hiện.
* **Trace ID & Span ID:** Trace ID dùng chung cho cả hành trình để liên kết các dịch vụ, còn Span ID để định danh từng bước nhỏ.

### 2. Cách hoạt động: Cơ chế "Propagating"
Làm sao Service B biết nó là con của Service A?

1.  **Service A** nhận request và tạo ra một **Trace ID**.
2.  Khi Service A gọi Service B, nó đính kèm Trace ID này vào **HTTP Header** (thường là header `b3` hoặc `traceparent`).
3.  **Service B** đọc header này, giữ nguyên Trace ID và tiếp tục tạo Span mới cho công việc của nó.
4.  Tất cả dịch vụ gửi dữ liệu này về một "nhà kho" tập trung để hiển thị.

### 3. Công cụ trong hệ sinh thái Spring Boot

* **Micrometer Tracing:** (Thay thế Spring Cloud Sleuth từ Spring Boot 3) Thư viện chuẩn để tạo và quản lý Trace/Span.
* **Tracing Backends (Nơi hiển thị):**
    * **Zipkin:** Phổ biến, nhẹ, giao diện đơn giản (biểu đồ Gantt).
    * **Jaeger:** Mạnh mẽ, thường dùng cho hệ thống lớn chạy Kubernetes.
    * **Tempo (Grafana):** Tích hợp mượt mà với Logs và Metrics trên cùng dashboard.

### 4. Cấu hình nhanh với Spring Boot 3 & Zipkin

**Bước 1: Thêm dependency (Maven)**
Bạn cần Micrometer để tạo trace và một "bridge" để gửi dữ liệu tới Zipkin.

```xml
	<dependency>
	    <groupId>io.micrometer</groupId>
	    <artifactId>micrometer-tracing-bridge-brave</artifactId>
	</dependency>
	<dependency>
	    <groupId>io.zipkin.reporter2</groupId>
	    <artifactId>zipkin-reporter-brave</artifactId>
	</dependency>
```

**Bước 2: Cấu hình `application.yml`**

```yaml
	management:
	  tracing:
	    sampling:
	      probability: 1.0 # 1.0 là lấy 100% request (môi trường dev)
	  zipkin:
	    tracing:
	      endpoint: "http://localhost:9411/api/v2/spans"
```

### 5. Tại sao nó quan trọng?

* **Phát hiện nút thắt cổ chai (Bottleneck):** Nhìn thấy ngay Service nào mất 2s trong khi các cái khác chỉ mất 10ms.
* **Dependency Mapping:** Tự động vẽ ra sơ đồ các service đang gọi nhau.
* **Troubleshooting:** Khi có lỗi, bạn chỉ cần lấy **Trace ID** từ log và dán vào Zipkin để xem chính xác nó "chết" ở bước nào.

---
**Kinh nghiệm:** Trong cấu hình log (`logback.xml`), hãy luôn in `traceId` và `spanId`. Khi có sự cố, ID này chính là "chìa khóa" để bạn tái dựng lại toàn bộ hiện trường vụ án trên dashboard tracing.
