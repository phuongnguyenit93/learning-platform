Để chia nhỏ một hệ thống Monolith mà không biến nó thành một "mớ hỗn độn phân tán" (Distributed Monolith), bạn cần nắm vững khái niệm **Bounded Context**.

## 1. Bounded Context là gì?

Trong một hệ thống lớn, một từ ngữ có thể mang ý nghĩa khác nhau tùy vào ngữ cảnh.
* **Ví dụ:** Thực thể `Product` (Sản phẩm).
    * Trong ngữ cảnh **Bán hàng (Sales)**: Nó quan tâm đến giá cả, khuyến mãi, mô tả sản phẩm.
    * Trong ngữ cảnh **Kho vận (Inventory)**: Nó quan tâm đến số lượng tồn kho, kích thước, khối lượng để đóng gói.
    * Trong ngữ cảnh **Giao hàng (Shipping)**: Nó quan tâm đến địa chỉ người nhận và đơn vị vận chuyển.

**Bounded Context** là một ranh giới logic mà bên trong đó, một mô hình dữ liệu (Domain Model) có ý nghĩa thống nhất và đặc thù nhất.

## 2. Cách xác định Bounded Context để chia Service

Để xác định ranh giới này, bạn có thể thực hiện theo các bước sau:

### Bước 1: Phân tích Ngôn ngữ chung (Ubiquitous Language)
Hãy nói chuyện với các chuyên gia nghiệp vụ (Product Owner, Stakeholders). Nếu bạn thấy khi nói về một đối tượng mà định nghĩa bắt đầu thay đổi, đó là dấu hiệu của một Bounded Context mới.

### Bước 2: Dựa trên quy trình nghiệp vụ (Business Capability)
Mỗi dịch vụ nên đại diện cho một khả năng kinh doanh cụ thể.
* Context Đặt hàng (Ordering)
* Context Thanh toán (Payment)
* Context Chăm sóc khách hàng (Support)

### Bước 3: Phân tích sự thay đổi (Pivot Point)
Nếu bạn thay đổi logic của module A mà module B cũng phải thay đổi theo và deploy cùng lúc, có nghĩa là ranh giới của bạn đang bị sai (Tight Coupling). Một Bounded Context chuẩn phải có tính **Tự trị (Autonomy)** cao.

## 3. Context Mapping: Cách các Service "nói chuyện"

Sau khi chia nhỏ, các Context cần tương tác với nhau. DDD cung cấp các kiểu quan hệ:

* **Shared Kernel:** Hai service dùng chung một phần nhỏ thư viện hoặc database (Hạn chế dùng trong Microservices).
* **Customer-Supplier:** Một bên cung cấp dữ liệu (Supplier), một bên tiêu thụ (Customer).
* **Anti-Corruption Layer (ACL):** Service A tạo ra một lớp đệm để chuyển đổi dữ liệu từ Service B sang định dạng mình mong muốn, tránh bị ảnh hưởng bởi sự thay đổi của Service B.

## 4. Tại sao DDD giúp tránh phụ thuộc lẫn nhau?

* **Dữ liệu độc lập:** Mỗi Bounded Context sở hữu Database riêng. Không có chuyện Service này "chọc" thẳng vào bảng của Service kia.
* **Giao tiếp qua Event:** Thay vì gọi trực tiếp (Request-Response), các Service giao tiếp qua các sự kiện (Domain Events) như `OrderCreated`, `PaymentConfirmed`. Điều này giúp hệ thống cực kỳ linh hoạt.

---

### 💡 Áp dụng vào dự án java-learning:

Khi bạn thiết kế module Microservices đầu tiên, hãy vẽ sơ đồ các thực thể. Nếu bạn thấy `User` xuất hiện ở khắp nơi với quá nhiều thuộc tính (vừa có password, vừa có địa chỉ ship, vừa có lịch sử mua hàng), hãy tách nó ra:
1. `UserAccount` (trong Identity Context)
2. `CustomerProfile` (trong Order Context)
3. `Recipient` (trong Shipping Context)

```java
   // Ví dụ về một Domain Event đơn giản trong Bounded Context Ordering
   public record OrderCreatedEvent(
       String orderId, 
       LocalDateTime createdAt, 
       BigDecimal totalAmount
   ) {}
```
