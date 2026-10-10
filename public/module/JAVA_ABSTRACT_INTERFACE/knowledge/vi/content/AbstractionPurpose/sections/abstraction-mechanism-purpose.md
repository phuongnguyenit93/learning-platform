### KHÁI NIỆM

Giả sử hàm thanh toán phụ thuộc trực tiếp vào `CardPayment`:

```java
void checkout(CardPayment payment) {
    payment.pay(100);
}
```

Cách viết này hoạt động, nhưng bên sử dụng bị gắn với một cách triển khai cụ thể. Khi hệ thống có thêm `WalletPayment`, `BankTransferPayment` hoặc một cách thanh toán khác, ta muốn bên gọi chỉ cần biết **hợp đồng thanh toán** thay vì biết từng lớp cụ thể.

Java cho phép biểu diễn nhu cầu đó bằng một kiểu chung. Trong module này, hai công cụ quan trọng là:

```text
lớp trừu tượng (abstract class)
→ phù hợp khi một nhóm lớp có quan hệ gần nhau
→ cần dùng chung trạng thái, quy tắc khởi tạo hoặc một phần cách triển khai

interface
→ phù hợp khi cần mô tả vai trò/khả năng dưới dạng hợp đồng
→ nhiều lớp ở các cây kế thừa khác nhau vẫn có thể cùng thực hiện
```

### VÌ SAO

Mục đích của hai cơ chế **không đơn giản là tạo ra kiểu “không thể `new`”**. Điều quan trọng hơn là tách ba nhu cầu thường bị trộn lẫn:

```text
bên sử dụng cần biết điều gì?
→ hợp đồng

các lớp liên quan cần dùng chung điều gì?
→ trạng thái / quy tắc khởi tạo / phần triển khai

một lớp cần đảm nhận thêm vai trò nào?
→ khả năng được biểu diễn bằng interface
```

Khi ba nhu cầu này được tách rõ, mã ít phụ thuộc vào lớp cụ thể hơn và mô hình kiểu dễ mở rộng hơn.
