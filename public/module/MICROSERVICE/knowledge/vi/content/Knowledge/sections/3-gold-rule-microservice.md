Trong thiết kế phần mềm bền vững, đặc biệt là khi dịch chuyển từ Monolith sang Microservices, đây là ba khái niệm cốt lõi. Nếu vi phạm, hệ thống của bạn sẽ trở thành một "hố đen" bảo trì.

## 1. Single Responsibility Principle (SRP - Đơn nhiệm)
> "Một class/module/service chỉ nên có duy nhất một lý do để thay đổi."

Trong Microservices, SRP áp dụng cho cả phạm vi dịch vụ (Service Boundary).
* **Ví dụ sai:** Một `OrderService` vừa lưu đơn hàng, vừa tính thuế, vừa gửi email, vừa quản lý kho. Khi logic thuế thay đổi, bạn phải deploy lại cả dịch vụ đặt hàng.
* **Ví dụ đúng:** Tách thành `OrderService` (quản lý trạng thái đơn) và `TaxService` (chỉ tính toán thuế).
* **Lợi ích:** Dễ hiểu, dễ kiểm thử và cô lập tác động khi thay đổi code.

## 2. Loose Coupling (Phụ thuộc lỏng lẻo)
> "Sự thay đổi bên trong một component không nên buộc các component khác phải thay đổi theo."

Đây là mục tiêu tối thượng của kiến trúc phân tán. Các thành phần kết nối nhưng không "dính chặt" vào nhau.

* **Cách đạt được:**
  * **Dùng Interface/Contract:** Service A gọi Service B qua API chuẩn (REST/gRPC) thay vì can thiệp vào DB của nhau.
  * **Dùng Message Broker:** Thay vì đợi Service B trả lời (Synchronous), A chỉ cần đẩy tin nhắn vào Kafka (Asynchronous).
* **Lợi ích:** Bạn có thể thay thế công nghệ của Service B (ví dụ từ Java sang Go) mà Service A không hề hay biết.

## 3. High Cohesion (Độ gắn kết cao)
> "Những thứ liên quan mật thiết với nhau thì nên được đặt cạnh nhau."

Cohesion tập trung vào việc tổ chức logic bên trong một đơn vị (class hoặc service).
* **Đặc điểm:** Một service có High Cohesion sẽ chứa các chức năng phục vụ cho cùng một mục đích nghiệp vụ duy nhất.
* **Mối quan hệ với SRP:** Nếu một service thực hiện quá nhiều việc khác nhau (**Low Cohesion**), nó đang vi phạm SRP.
* **Ví dụ:** Trong `PaymentService`, các hàm `validateCard()`, `capturePayment()`, `refund()` có độ gắn kết cao. Nếu thêm hàm `generateShippingLabel()` vào đây, độ gắn kết sẽ giảm xuống.

---

## 📊 Mối liên quan giữa 3 nguyên lý

| Cặp tương tác | Ý nghĩa |
| :--- | :--- |
| **High Cohesion + Loose Coupling** | **Trạng thái lý tưởng.** Logic liên quan ở cùng một chỗ, nhưng các nhóm logic khác nhau thì không phụ thuộc quá mức vào nhau. |
| **SRP + High Cohesion** | Khi tuân thủ SRP, bạn mặc nhiên tạo ra các module có độ gắn kết cao vì chúng chỉ tập trung vào một nhiệm vụ. |
| **Low Cohesion -> Tight Coupling** | Nếu một service làm quá nhiều việc, nó phải kết nối với quá nhiều DB và service khác, dẫn đến bị "trói chặt" vào hệ thống. |

---

## 🛠️ Áp dụng vào thực tế (Java/Spring Boot)

Nếu bạn đang phát triển repository `java-learning`, hãy thực hành như sau:

1.  **SRP:** Tách logic xử lý file và logic gửi mail ra khỏi `Controller` (đưa vào các `@Service` riêng biệt).
2.  **Loose Coupling:** Sử dụng `@Autowired` với **Interface** thay vì Implementation class cụ thể.
3.  **High Cohesion:** Đóng gói các class liên quan đến Security (Filter, Provider, DetailService) vào cùng một package `config.security`.

```java
    // Ví dụ về Loose Coupling qua Interface
    @Service
    public class OrderService {
        // Phụ thuộc vào Interface, không quan tâm nó gửi qua Mail hay SMS
        private final NotificationClient notificationClient; 

        public OrderService(NotificationClient notificationClient) {
            this.notificationClient = notificationClient;
        }
    }
```
