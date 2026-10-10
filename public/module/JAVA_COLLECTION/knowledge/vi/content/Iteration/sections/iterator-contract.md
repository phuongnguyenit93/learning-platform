`Iterator<E>` đại diện cho một con trỏ logic đi qua một chuỗi phần tử:

```java
Iterator<Order> iterator = orders.iterator();

while (iterator.hasNext()) {
    Order order = iterator.next();
    System.out.println(order.id());
}
```

Ba thao tác cốt lõi:

- `hasNext()` hỏi còn phần tử tiếp theo hay không;
- `next()` trả phần tử tiếp theo và tiến con trỏ;
- `remove()` là thao tác xóa **tùy chọn**, chỉ có khi iterator cụ thể hỗ trợ.

Nếu gọi `next()` khi không còn phần tử, iterator ném `NoSuchElementException`. Bên gọi không nên dùng ngoại lệ như điều kiện vòng lặp bình thường; mẫu chuẩn là kiểm tra `hasNext()` trước.

`Iterator` không hứa mọi cấu trúc có cùng thứ tự. Thứ tự của iterator đến từ collection:

- `ArrayList` duyệt theo thứ tự của List;
- `LinkedHashSet` duyệt theo thứ tự duyệt của nó;
- `TreeSet` duyệt theo thứ tự sắp xếp;
- `HashSet` không hứa một thứ tự duyệt cụ thể;
- iterator của `PriorityQueue` không hứa duyệt theo thứ tự ưu tiên.

Điều này cho phép thuật toán viết theo interface mà vẫn tôn trọng ngữ nghĩa của nguồn:

```java
void printOrders(Iterable<Order> source) {
    Iterator<Order> it = source.iterator();
    while (it.hasNext()) {
        System.out.println(it.next());
    }
}
```

Iterator thường giữ trạng thái và dùng cho một lần duyệt tiến về phía trước. Muốn duyệt lại, thường cần lấy iterator mới từ collection.

Việc sửa trực tiếp cấu trúc collection trong lúc đang dùng iterator có thể làm mất hiệu lực các giả định của iterator và dẫn tới hành vi fail-fast ở nhiều collection thông thường. Chương Fail-Fast sẽ đi sâu vào `ConcurrentModificationException`; ở đây chỉ cần biết rằng thay đổi dữ liệu trong lúc duyệt phải theo đúng quy ước của iterator/collection.
