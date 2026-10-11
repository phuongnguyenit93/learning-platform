### VÌ SAO — kế thừa mạnh nhưng tạo phụ thuộc mạnh

Class con có thể phụ thuộc không chỉ vào hợp đồng công khai của class cha mà còn vào:

- thứ tự khởi tạo;
- phương thức `protected`;
- cách class cha gọi các phương thức có thể bị ghi đè;
- những giả định bên trong cách triển khai của class cha.

Một ví dụ điển hình là class cha gọi phương thức có thể bị ghi đè trong quá trình khởi tạo. Phân phối động vẫn có thể đi vào phần triển khai của class con **trước khi trạng thái riêng của class con được khởi tạo đầy đủ**; trường tham chiếu khi đó vẫn có thể mang giá trị mặc định `null`, nên code của class con có thể gặp `NullPointerException` nếu giả định trạng thái đã sẵn sàng.

Cơ chế và ví dụ thực thi chi tiết thuộc `class-object → Vòng đời tạo Object → Dynamic Dispatch trong Constructor`. Trong OOP, điều cần giữ là **hệ quả coupling**: mức phụ thuộc do kế thừa không chỉ nằm ở API công khai; class con còn có thể bị ảnh hưởng bởi **thứ tự vòng đời và quyết định thực thi nội bộ của class cha**.

Đây là một dạng **fragile base class** (class cha dễ gây hiệu ứng dây chuyền): thay đổi ở class cha có thể gây ảnh hưởng bất ngờ tới class con.

### ĐÁNH ĐỔI — khi nào kế thừa hợp lý?

Kế thừa phù hợp hơn khi:

- quan hệ kiểu con có ý nghĩa thực sự về hành vi;
- bên sử dụng cần khả năng thay thế giữa các kiểu con;
- class cha có hợp đồng tương đối ổn định;
- class con không phải ghi đè hàng loạt phương thức chỉ để tránh các giả định của class cha.

Kế thừa đáng nghi khi lý do chính chỉ là:

> “Tôi muốn dùng lại vài phương thức để khỏi phải sao chép mã.”

Trong trường hợp đó, kết hợp đối tượng (`composition`) hoặc ủy quyền (`delegation`) thường rõ ràng và ít phụ thuộc hơn.

### MỐI LIÊN HỆ — từ kế thừa sang đa hình

Khi một biến kiểu `PaymentMethod` có thể trỏ tới `CardPayment`, `WalletPayment` hoặc một cách triển khai khác, bên gọi không nên phải viết:

```java
if (payment instanceof CardPayment) { ... }
else if (payment instanceof WalletPayment) { ... }
```

cho mọi loại payment.

**Đa hình (polymorphism)** giải quyết chính vấn đề này.
