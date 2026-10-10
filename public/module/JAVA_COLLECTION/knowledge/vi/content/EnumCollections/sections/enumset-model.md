`EnumSet<E extends Enum<E>>` là `Set` chuyên cho phần tử của **một kiểu enum**. JDK mô tả cách biểu diễn của nó như một vector bit, nên mỗi hằng enum có thể được ánh xạ rất gọn vào một vị trí bit.

```java
EnumSet<OrderStatus> active = EnumSet.of(
        OrderStatus.NEW,
        OrderStatus.PAID,
        OrderStatus.PACKING
);

boolean needsWork = active.contains(OrderStatus.PAID);
```

Các phương thức tạo làm ý định miền rõ:

```java
EnumSet<OrderStatus> none = EnumSet.noneOf(OrderStatus.class);
EnumSet<OrderStatus> all = EnumSet.allOf(OrderStatus.class);
EnumSet<OrderStatus> shippingFlow =
        EnumSet.range(OrderStatus.PAID, OrderStatus.SHIPPED);
EnumSet<OrderStatus> inactive = EnumSet.complementOf(active);
```

`EnumSet` luôn duyệt theo **thứ tự tự nhiên của enum**, tức thứ tự các hằng được khai báo, không phải thứ tự chèn. Nó không cho phần tử `null` và không tự đồng bộ hóa.

Có thứ tự xác định không đồng nghĩa với việc là `SequencedSet` trong Java 21: `EnumSet` có thứ tự duyệt theo thứ tự khai báo riêng nhưng không triển khai `SequencedSet`. Vì vậy không nên suy ra API đầu/cuối/đảo thứ tự của sequenced collection chỉ từ việc một collection có thứ tự duyệt ổn định.

Iterator của `EnumSet` là **nhất quán yếu (weakly consistent)**: không ném `ConcurrentModificationException` và có thể có hoặc không phản ánh thay đổi xảy ra sau khi iterator được tạo. Quy ước này khác với iterator fail-fast của các collection như `ArrayList`.

Vì tập enum là hữu hạn và đã biết, `EnumSet` rất phù hợp cho các nhóm cờ, khả năng hoặc trạng thái. Nếu nghiệp vụ cần giữ thứ tự chèn tùy ý, `LinkedHashSet` mới là quy ước đúng hơn.
