Các chương dùng cùng một mô hình để tránh học từng khái niệm rời rạc:

```text
PaymentMethod
→ interface mô tả hợp đồng thanh toán

BasePayment
→ lớp trừu tượng giữ trạng thái và phần triển khai chung

CardPayment
→ lớp cụ thể hoàn thiện hành vi

Refundable
→ interface bổ sung một khả năng độc lập
```

Ví dụ này sẽ lần lượt cho thấy khi nào cần hợp đồng, khi nào cần phần triển khai dùng chung, cách interface kế thừa nhau và cách xử lý xung đột giữa các hành vi mặc định.
