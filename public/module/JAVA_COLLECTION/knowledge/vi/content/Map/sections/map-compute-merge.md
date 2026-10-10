Nhiều bài toán Map có dạng “đọc giá trị cũ, tính giá trị mới rồi ghi lại”. `Map` có các phương thức giúp diễn đạt trực tiếp mẫu này.

Đếm số đơn hàng theo người dùng:

```java
Map<Long, Integer> orderCountByUser = new HashMap<>();

for (Order order : orders) {
    orderCountByUser.merge(order.userId(), 1, Integer::sum);
}
```

`merge(key, value, remappingFunction)` yêu cầu `value` đưa vào khác `null`:

- nếu chưa có ánh xạ hoặc ánh xạ hiện tại là `null`, dùng giá trị được cung cấp;
- nếu đã có giá trị khác `null`, gọi hàm ánh xạ lại với giá trị cũ/mới;
- nếu hàm ánh xạ lại trả `null`, ánh xạ bị xóa.

Tạo collection theo khóa:

```java
Map<Long, List<Order>> ordersByUser = new HashMap<>();

for (Order order : orders) {
    ordersByUser
            .computeIfAbsent(order.userId(), id -> new ArrayList<>())
            .add(order);
}
```

`computeIfAbsent` chỉ tạo giá trị khi khóa chưa có ánh xạ khác `null`; nếu hàm ánh xạ trả `null` thì không tạo ánh xạ.

Khi cần tính lại dựa trên cả khóa và giá trị hiện tại:

```java
totals.compute(userId, (id, current) ->
        current == null ? order.totalCents() : current + order.totalCents()
);
```

Nếu hàm ánh xạ lại của `compute` trả `null`, ánh xạ bị xóa.

Các API này làm logic cập nhật ngắn và gần với ý định hơn mẫu `get → if → put`. Tuy nhiên không nên suy ra rằng mọi `Map` khiến chuỗi cập nhật trở thành nguyên tử trong môi trường nhiều luồng; tính nguyên tử cụ thể thuộc quy ước của các cách triển khai như `ConcurrentMap`/`ConcurrentHashMap` và thuộc module về xử lý đồng thời.
