`EnumMap<K extends Enum<K>, V>` là `Map` chuyên cho khóa enum. JDK triển khai nó bằng cách biểu diễn dựa trên mảng, tận dụng `ordinal` nội bộ để truy cập vị trí khóa hiệu quả mà không cần bucket hash tổng quát.

```java
EnumMap<OrderStatus, Integer> counts =
        new EnumMap<>(OrderStatus.class);

counts.put(OrderStatus.NEW, 5);
counts.put(OrderStatus.PAID, 12);
counts.put(OrderStatus.SHIPPED, 8);

System.out.println(counts.get(OrderStatus.PAID)); // 12
```

Khóa được duyệt theo thứ tự khai báo của enum, tạo thứ tự duyệt ổn định và dễ dự đoán:

```java
for (var entry : counts.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}
```

`EnumMap` không cho `null` khóa nhưng cho phép `null` giá trị. Nếu lưu null giá trị, `get(key) == null` không phân biệt được “không có ánh xạ” và “ánh xạ có giá trị null”; dùng `containsKey` khi cần phân biệt.

Tương tự `EnumSet`, `EnumMap` có thứ tự duyệt xác định nhưng không triển khai `SequencedMap`. `SequencedMap` chuẩn hóa các thao tác đầu/cuối/đảo thứ tự cho những Map tham gia interface đó; nó không phải điều kiện bắt buộc để một Map có thứ tự xác định.

Iterator của các khung nhìn dạng Collection của `EnumMap` cũng **nhất quán yếu (weakly consistent)**: không ném `ConcurrentModificationException` và có thể có hoặc không quan sát thay đổi sau thời điểm tạo iterator.

Giống `EnumSet`, `EnumMap` không tự đồng bộ hóa. Khi cần chia sẻ dữ liệu có thể thay đổi giữa nhiều luồng, phải áp dụng chiến lược xử lý đồng thời riêng.
