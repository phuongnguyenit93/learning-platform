Một interface có thể `extends` nhiều interface:

```java
interface AuditedPayment extends Payable, Auditable { ... }
```

Đây là đa kế thừa về **kiểu/hợp đồng**. Interface không đóng góp trạng thái riêng cho từng đối tượng, và cơ chế này không phải đa kế thừa lớp.

Nếu các phương thức abstract có chữ ký tương thích, các hợp đồng có thể kết hợp tự nhiên. Nếu kiểu trả về xung đột và không thể thỏa đồng thời, interface con có thể không hợp lệ ngay tại thời điểm biên dịch.

Các xung đột liên quan tới phương thức `default` được tách sang phần sau, sau khi vai trò của `default` đã được giải thích đầy đủ.
