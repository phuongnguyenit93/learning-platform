### KHÁI NIỆM

`interface` mô tả một **vai trò hoặc hợp đồng hành vi** mà nhiều loại lớp có thể thực hiện. Trong Java 21, lớp thông thường, lớp `enum`, lớp `record` và cả lớp đại diện (proxy) được tạo động đều có thể triển khai interface khi phù hợp.

```java
interface PaymentMethod {
    void pay(int amount);
}
```

Một lớp triển khai `PaymentMethod` cam kết rằng bên sử dụng có thể yêu cầu `pay(...)` thông qua kiểu `PaymentMethod` mà không cần biết lớp cụ thể phía sau là gì.

### VÌ SAO

Interface giúp giảm phụ thuộc vào cách triển khai cụ thể:

```java
void checkout(PaymentMethod payment) {
    payment.pay(100);
}
```

`checkout(...)` phụ thuộc vào hợp đồng `PaymentMethod`, không phụ thuộc trực tiếp vào `CardPayment`, `WalletPayment` hay một lớp cụ thể khác.
