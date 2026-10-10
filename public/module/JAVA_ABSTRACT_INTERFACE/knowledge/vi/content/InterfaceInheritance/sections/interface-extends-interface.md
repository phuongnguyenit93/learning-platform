Interface dùng `extends` để kế thừa một hoặc nhiều interface khác:

```java
interface Payable {
    void pay();
}

interface RefundablePayment extends Payable {
    void refund();
}
```

Lớp triển khai `RefundablePayment` phải thỏa cả `pay()` và `refund()`.

Interface con cũng có thể bổ sung phương thức mới hoặc tinh chỉnh kiểu trả về nếu vẫn tương thích với hợp đồng được kế thừa.
