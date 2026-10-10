Datadog thực tế là một trong những giải pháp hàng đầu trong mảng Distributed Tracing (thuộc bộ giải pháp **APM - Application Performance Monitoring**). So với Zipkin hay Jaeger, Datadog là một nền tảng trả phí (SaaS) mạnh mẽ và toàn diện hơn rất nhiều.

### 1. Datadog Tracing khác gì với Zipkin/Jaeger?

* **Tính toàn diện:** Zipkin chỉ tập trung vào Trace. Datadog kết nối **Trace + Log + Metrics + Hạ tầng** trên cùng một màn hình.
* **Auto-Instrumentation:** Datadog Agent tự động "tiêm" mã vào ứng dụng Java để thu thập dữ liệu mà không cần viết nhiều code cấu hình.
* **Chi phí:** Zipkin miễn phí (tự vận hành), Datadog tính phí dựa trên số lượng host hoặc lượng dữ liệu.

### 2. Cách triển khai Datadog Tracing trong Spring Boot

Trong Microservices, bạn thường chạy một con **Datadog Agent** (Docker/OS). Ứng dụng sẽ gửi dữ liệu qua Agent này.

**Sử dụng Java Agent (Zero-code instrumentation)**
Bạn không cần thêm dependency vào `pom.xml`. Chỉ cần tải file `dd-java-agent.jar` và chạy ứng dụng với tham số:

	```bash
	java -javaagent:path/to/dd-java-agent.jar \
	     -Ddd.service=order-service \
	     -Ddd.env=dev \
	     -Ddd.trace.agent.url=http://localhost:8126 \
	     -jar my-app.jar
	```

* **Cơ chế:** Java Agent tự động "bọc" các thư viện như Spring Web, Hibernate, Kafka... để tạo Trace/Span và gửi về Agent local (cổng 8126).

### 3. Những tính năng "đáng tiền" của Datadog

* **Service Map:** Tự động vẽ sơ đồ toàn bộ hệ thống. Thấy rõ Service A gọi B qua Kafka, B gọi Database... theo thời gian thực.
* **Error Tracking:** Gom nhóm các lỗi giống nhau, cung cấp Stack Trace chi tiết và tần suất xuất hiện lỗi.
* **Continuous Profiler:** Cho biết chính xác **dòng code nào** đang ngốn nhiều CPU hoặc RAM nhất ngay khi request đang thực thi.

### 4. Bảng so sánh lựa chọn

| Tiêu chí | Zipkin / Jaeger / Micrometer | Datadog APM |
| :--- | :--- | :--- |
| **Giá cả** | Miễn phí (tốn phí vận hành) | Khá đắt |
| **Cài đặt** | Cấu hình thủ công trong code | Tự động hoàn toàn (Zero-code) |
| **Lưu trữ** | Tự quản lý (Elasticsearch/S3) | Datadog quản lý toàn bộ |
| **Phù hợp** | Học tập, dự án nhỏ, thích tự chủ | Doanh nghiệp lớn, hệ thống phức tạp |

---
**Lời khuyên:** Nếu bạn đang làm dự án `java-learning` để hiểu bản chất, hãy bắt đầu với **Zipkin**. Khi làm việc trong các hệ thống doanh nghiệp yêu cầu độ ổn định cực cao và khả năng quan sát (observability) sâu, **Datadog** sẽ là người bạn đồng hành không thể thiếu.
