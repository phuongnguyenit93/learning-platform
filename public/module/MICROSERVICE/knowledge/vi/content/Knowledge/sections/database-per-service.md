Trong kiến trúc Microservices, **Database per Service** là nguyên lý tối thượng. Thay vì một "Shared Database" khổng lồ, mỗi dịch vụ sẽ toàn quyền sở hữu và quản lý dữ liệu riêng của nó.

## 1. Tại sao mỗi Service nên có Database riêng?

Việc tách biệt cơ sở dữ liệu giúp hệ thống đạt được các mục tiêu chiến lược:

* **Tính độc lập (Loose Coupling):** Thay đổi cấu trúc bảng (schema) của Service A không bao giờ làm hỏng code của Service B. Các team tự do nâng cấp DB mà không cần "xin phép" các team khác.
* **Khả năng mở rộng (Scalability):** Bạn có thể chọn loại DB phù hợp nhất cho từng bài toán.
  * *Ví dụ:* Service "Đơn hàng" dùng **NoSQL (MongoDB)** để ghi nhanh; Service "Tài chính" dùng **RDBMS (PostgreSQL)** để đảm bảo tính toàn vẹn (ACID).
* **Cô lập lỗi (Fault Isolation):** Nếu DB của Service A bị treo, Service B và C vẫn hoạt động bình thường với dữ liệu của riêng chúng.

## 2. Các kỹ thuật quản lý dữ liệu phân tán

Thách thức lớn nhất khi tách DB là làm sao để dữ liệu vẫn "khớp" với nhau. Dưới đây là 4 kỹ thuật cốt lõi:

### A. Giao tiếp qua API (Quy tắc vàng)
**Tuyệt đối không** cho phép Service A truy cập trực tiếp vào DB của Service B. Mọi yêu cầu lấy dữ liệu phải đi qua:
* **REST API / gRPC:** Gọi trực tiếp để lấy dữ liệu thời gian thực.
* **Message Broker (Kafka/RabbitMQ):** Lấy dữ liệu qua các sự kiện được phát ra.

### B. Saga Pattern (Quản lý giao dịch phân tán)
Thay thế cho cơ chế `BEGIN TRANSACTION` truyền thống bằng một chuỗi các giao dịch địa phương (Local Transactions).

* **Choreography:** Các service tự quan sát Event của nhau để thực hiện bước tiếp theo.
* **Orchestration:** Có một bộ điều phối trung tâm chỉ định luồng công việc. Nếu một bước lỗi, nó sẽ ra lệnh thực hiện **Giao dịch bù (Compensating Transaction)** để hoàn tác dữ liệu ở các bước trước.

### C. CQRS (Command Query Responsibility Segregation)
Tách biệt luồng **Ghi** (Command) và luồng **Đọc** (Query) để tối ưu hiệu năng.
* Dữ liệu từ nhiều service được đồng bộ về một **View Database** chung (Elasticsearch hoặc Redis) để phục vụ các truy vấn phức tạp mà không cần join nhiều API.

### D. API Composition
Cách đơn giản nhất: API Gateway hoặc một service trung gian sẽ gọi đến các service thành phần, lấy dữ liệu về, thực hiện "Join" trong bộ nhớ và trả kết quả cho người dùng.

---

## 📊 Tóm tắt quy tắc thiết kế "Sống còn"

1.  **Dữ liệu là riêng tư:** Service chỉ lộ dữ liệu qua API công khai, giấu kín cấu trúc bảng bên trong.
2.  **Chấp nhận tính nhất quán sau (Eventual Consistency):** Dữ liệu có thể không giống hệt nhau ở mọi DB ngay lập tức, nhưng sẽ đồng bộ sau vài giây thông qua các Event.
3.  **Hạn chế Join phân tán:** Thiết kế ranh giới Service (Bounded Context) tốt để giảm thiểu việc một request phải gọi quá nhiều service khác nhau.

```java
    // Ví dụ tư duy Event-driven để đồng bộ dữ liệu
    @Service
    public class OrderService {
        @Transactional
        public void createOrder(Order order) {
            orderRepository.save(order);
            // Phát ra event để các service khác (Kho, Thanh toán) cập nhật
            eventPublisher.publish(new OrderCreatedEvent(order.getId()));
        }
    }
```
