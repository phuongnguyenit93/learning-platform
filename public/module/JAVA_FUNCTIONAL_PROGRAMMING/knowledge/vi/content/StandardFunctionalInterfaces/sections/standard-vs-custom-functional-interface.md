Nên ưu tiên giao diện hàm chuẩn khi chính hợp đồng của nó đã diễn đạt đủ rõ ý định:

```java
Predicate<Order> eligible;
Function<Order, BigDecimal> totalCalculator;
Supplier<Clock> clockSupplier;
```

Nên tạo giao diện hàm theo miền nghiệp vụ khi ý nghĩa nghiệp vụ đủ quan trọng để cần một tên hợp đồng riêng:

```java
@FunctionalInterface
interface FraudRule {
    boolean isSuspicious(Payment payment);
}
```

Đây là quyết định về khả năng đọc và thiết kế API, không phải cuộc thi giảm số lượng kiểu tự định nghĩa.

Dùng giao diện chuẩn khi:

- hình dạng đầu vào/đầu ra đã nói đủ rõ hành vi;
- bên gọi hưởng lợi từ từ vựng Java quen thuộc;
- các phép kết hợp chuẩn có ích.

Dùng giao diện riêng khi:

- vai trò nghiệp vụ cần một tên rõ ràng;
- hợp đồng cần ngoại lệ được kiểm tra (checked exception) hoặc cam kết riêng của miền nghiệp vụ;
- dùng `Function`/`Predicate` làm mất ý nghĩa quan trọng ở API.

Dù chọn dạng nào, hợp đồng hàm vẫn nên tập trung vào một hành vi thống nhất và dễ hiểu.
