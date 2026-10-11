Nhóm `Bi...` mô tả các hợp đồng quen thuộc có hai đầu vào.

```java
BiFunction<BigDecimal, Integer, BigDecimal> multiply =
        (price, quantity) -> price.multiply(BigDecimal.valueOf(quantity));

BiPredicate<String, Integer> minimumLength =
        (text, minimum) -> text.length() >= minimum;

BiConsumer<Map<String, Integer>, String> increment =
        (counts, key) -> counts.merge(key, 1, Integer::sum);
```

Hình dạng tương ứng:

- `BiFunction<T, U, R>`: hai đầu vào, một đầu ra;
- `BiPredicate<T, U>`: hai đầu vào, kết quả `boolean`;
- `BiConsumer<T, U>`: hai đầu vào, không có đầu ra.

`java.util.function` không có sẵn một họ `TriFunction` tổng quát. Nếu hành vi cần rất nhiều tham số, trước khi tạo giao diện nhiều tham số riêng nên cân nhắc xem một đối tượng miền nghiệp vụ nhỏ có thể làm hợp đồng dễ hiểu hơn không.
