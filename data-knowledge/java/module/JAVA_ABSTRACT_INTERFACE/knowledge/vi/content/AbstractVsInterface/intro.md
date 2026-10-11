# Chọn lớp trừu tượng hay interface?

Không có quy tắc “interface luôn tốt hơn abstract class” hoặc ngược lại. Hai cơ chế giải quyết những nhu cầu có phần giao nhau nhưng không giống nhau. Việc lựa chọn nên bắt đầu từ **mối quan hệ cần mô hình hóa**, không phải từ sở thích cú pháp.

Hãy quay lại bài toán thanh toán:

```text
PaymentMethod
→ mọi cách thanh toán đều phải thực hiện pay(...)

BasePayment
→ một số cách thanh toán cùng chia sẻ trạng thái `provider`, kiểm tra hợp lệ và hành vi nền

Refundable
→ chỉ những cách thanh toán hỗ trợ hoàn tiền mới cần khả năng này
```

Ba nhu cầu này không nên bị ép vào một cơ chế duy nhất. Hợp đồng cho bên sử dụng, phần triển khai dùng chung và khả năng bổ sung là ba trách nhiệm khác nhau.
