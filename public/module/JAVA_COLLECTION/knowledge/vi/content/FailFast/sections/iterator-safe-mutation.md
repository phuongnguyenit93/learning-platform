Nếu cần xóa phần tử hiện tại trong lúc duyệt, hãy dùng thao tác mà iterator cho phép:

```java
List<Order> orders = new ArrayList<>(List.of(
        new Order(1, 1, 20_000),
        new Order(2, 2, 0),
        new Order(3, 3, 15_000)
));

Iterator<Order> iterator = orders.iterator();
while (iterator.hasNext()) {
    Order order = iterator.next();
    if (order.totalCents() == 0) {
        iterator.remove();
    }
}
```

`Iterator.remove()` gắn thay đổi dữ liệu với đúng trạng thái duyệt hiện tại. Thông thường cần gọi `next()` trước và không được gọi `remove()` hai lần cho cùng một phần tử nếu chưa có `next()` mới.

Khi logic chỉ là lọc/xóa theo điều kiện, API mức cao thường rõ hơn:

```java
orders.removeIf(order -> order.totalCents() == 0);
```

Với `ListIterator`, các thao tác như `add`, `remove` và `set` có quy ước riêng để thay đổi dữ liệu trong lúc duyệt. Với Map, có thể duyệt `entrySet().iterator()` rồi gọi `iterator.remove()`.

Điểm chung là thay đổi dữ liệu phải đi qua cơ chế mà giao thức duyệt hỗ trợ. Nếu yêu cầu là “một luồng duyệt trong khi luồng khác sửa”, đó là bài toán về collection hỗ trợ truy cập đồng thời và đồng bộ hóa, chứ không phải mẹo tránh CME.
