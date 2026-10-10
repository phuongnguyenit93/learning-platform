Một lỗi phổ biến là xóa trực tiếp từ collection trong vòng `for-each`:

```java
for (Order order : orders) {
    if (order.totalCents() == 0) {
        orders.remove(order); // có thể làm iterator đang dùng mất hiệu lực
    }
}
```

Với iterator hỗ trợ `remove`, cách đúng là xóa thông qua chính iterator đó:

```java
Iterator<Order> it = orders.iterator();

while (it.hasNext()) {
    Order order = it.next();
    if (order.totalCents() == 0) {
        it.remove();
    }
}
```

`Iterator.remove()` xóa phần tử cuối cùng vừa được `next()` trả về. Quy ước có hai giới hạn quan trọng:

1. `remove()` là thao tác tùy chọn; iterator của collection không cho phép sửa hoặc cách triển khai không hỗ trợ có thể ném `UnsupportedOperationException`;
2. không được gọi `remove()` trước `next()` hoặc gọi hai lần liên tiếp cho cùng một `next()`; trường hợp đó ném `IllegalStateException`.

Ví dụ:

```java
Iterator<Order> it = orders.iterator();

Order first = it.next();
it.remove(); // hợp lệ nếu iterator hỗ trợ

// it.remove(); // IllegalStateException: chưa có next() mới
```

Khi chỉ cần lọc một collection có thể thay đổi theo điều kiện, `removeIf` thường biểu đạt ý định gọn hơn:

```java
orders.removeIf(order -> order.totalCents() == 0);
```

Nhưng hiểu `Iterator.remove()` vẫn quan trọng vì nó giải thích thay đổi dữ liệu được phối hợp với quá trình duyệt như thế nào. Các chi tiết fail-fast và thay đổi cấu trúc thuộc chương riêng sau đó.
