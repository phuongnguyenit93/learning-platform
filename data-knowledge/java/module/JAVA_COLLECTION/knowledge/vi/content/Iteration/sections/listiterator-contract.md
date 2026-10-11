`ListIterator<E>` mở rộng ý tưởng của `Iterator` riêng cho `List`. Ngoài đi tới trước, nó có thể đi lùi, biết chỉ số lân cận và cung cấp các thao tác thay đổi dữ liệu gắn với vị trí duyệt.

```java
List<Order> orders = new ArrayList<>(List.of(orderA, orderB, orderC));
ListIterator<Order> it = orders.listIterator();

while (it.hasNext()) {
    int index = it.nextIndex();
    Order order = it.next();
    System.out.println(index + " -> " + order.id());
}

while (it.hasPrevious()) {
    Order order = it.previous();
    System.out.println(order.id());
}
```

Các thao tác đặc trưng:

| thao tác | Ý nghĩa |
| --- | --- |
| `hasPrevious()` / `previous()` | duyệt ngược |
| `nextIndex()` / `previousIndex()` | quan sát vị trí con trỏ |
| `set(e)` | thay phần tử vừa được `next/previous` trả về |
| `add(e)` | chèn tại vị trí con trỏ |
| `remove()` | xóa phần tử vừa được quá trình duyệt trả về |

Ví dụ chuẩn hóa một Order trong khi duyệt:

```java
ListIterator<Order> it = orders.listIterator();
while (it.hasNext()) {
    Order current = it.next();
    if (current.totalCents() < 0) {
        it.set(new Order(current.id(), current.userId(), 0));
    }
}
```

`ListIterator` hữu ích khi thuật toán thật sự cần **vị trí + duyệt hai chiều + thay đổi dữ liệu phối hợp với quá trình duyệt**. Nếu chỉ cần đọc từng phần tử, vòng `for-each` đơn giản hơn; nếu chỉ cần xóa theo điều kiện, `removeIf` thường rõ hơn. `add/set/remove` vẫn là các thao tác tùy chọn nếu List phía dưới không hỗ trợ thay đổi dữ liệu.
