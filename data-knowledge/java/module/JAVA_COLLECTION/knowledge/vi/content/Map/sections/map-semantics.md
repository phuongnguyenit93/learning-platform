`Map<K, V>` lưu các ánh xạ `khóa → giá trị`. Mỗi khóa chỉ xuất hiện tối đa một lần, trong khi nhiều khóa có thể trỏ tới các giá trị bằng nhau.

```java
Map<Long, Order> orderById = new HashMap<>();

orderById.put(1001L, new Order(1001, 7, 120));
orderById.put(1002L, new Order(1002, 8, 90));

Order order = orderById.get(1002L);
```

Nếu `put` một khóa đã tồn tại, ánh xạ cũ bị thay thế và phương thức trả về giá trị trước đó:

```java
Order previous = orderById.put(
        1002L,
        new Order(1002, 8, 110)
);
```

Điều này khác `Set`: `Set` hỏi “phần tử này đã tồn tại chưa?”, còn `Map` hỏi “khóa này đang ánh xạ tới giá trị nào?”.
