Ngoài những vấn đề về giao tiếp và chịu lỗi, khi bước vào Microservices, một Java Backend Developer sẽ đối mặt với các thử thách cực kỳ quan trọng sau đây:

### 1. Tính nhất quán của dữ liệu (Data Consistency)
Trong Monolith, bạn dùng `@Transactional` là xong. Nhưng trong Microservices, mỗi service có một Database riêng, bạn không thể dùng Transaction truyền thống.

* **Vấn đề:** Order Service tạo đơn hàng thành công, nhưng Payment Service báo lỗi. Làm sao để "hoàn tác" (Rollback) ở Order Service?
* **Giải pháp: Saga Pattern**
  * **Choreography:** Các service tự trao đổi qua Message Broker (RabbitMQ) để xử lý.
  * **Orchestration:** Có một "nhạc trưởng" điều phối, nếu bước sau lỗi thì ra lệnh cho bước trước chạy hàm bù đắp (**Compensating Transaction**).

### 2. Quản lý danh tính và bảo mật (Distributed Security)
Bạn không thể bắt người dùng đăng nhập lại mỗi khi request chuyển giữa các Service.

* **Vấn đề:** Làm sao để các service con biết được người dùng đã login và có quyền thực hiện hành động?
* **Giải pháp:**
  * **Stateless Auth với JWT:** Gateway xác thực người dùng, sau đó đính kèm JWT vào Header của mọi request gửi vào nội bộ.
  * **OAuth2 / OpenID Connect:** Sử dụng Authorization Server tập trung (như Keycloak hoặc Okta).

### 3. Service Mesh (Khi hệ thống trở nên khổng lồ)
Khi có hàng trăm service, việc nhét Resilience4j hay Eureka Client vào từng file `pom.xml` trở nên mệt mỏi.

* **Vấn đề:** Muốn thay đổi cấu hình "cầu chì" cho toàn bộ 100 service cùng lúc mà không sửa code hay restart.
* **Giải pháp: Service Mesh (Istio, Linkerd)**
  * Tách toàn bộ logic kết nối, bảo mật, đo lường ra khỏi code Java.
  * Chạy như một **Sidecar** đi kèm với Container. Code của bạn chỉ tập trung logic nghiệp vụ, việc gọi nhau và xử lý lỗi do Mesh lo.

### 4. Kiểm thử hệ thống (Distributed Testing)
Trong Microservices, bạn cần nhiều hơn là Unit Test thông thường:

* **Contract Testing:** Đảm bảo khi Service A đổi cấu trúc JSON, nó không làm Service B sập.
* **End-to-End Testing:** Chạy toàn bộ luồng từ Gateway -> A -> B -> DB để đảm bảo khớp nối.

---

### Tổng kết lộ trình thực tế (Dự án java-learning)

Để không bị ngợp, hãy đi theo thứ tự sau:

1.  **Giai đoạn 1 (Hiện tại):** Hoàn thiện gọi nhau qua Gateway/Eureka và xử lý lỗi bằng Resilience4j.
2.  **Giai đoạn 2:** Tích hợp **RabbitMQ** để làm quen với tương tác bất đồng bộ (Event-driven).
3.  **Giai đoạn 3:** Thử nghiệm **Saga Pattern** đơn giản (nếu A lỗi thì gửi message cho B xóa dữ liệu).
4.  **Giai đoạn 4:** Triển khai **ELK Stack** hoặc **Prometheus** để quan sát chỉ số hệ thống.
