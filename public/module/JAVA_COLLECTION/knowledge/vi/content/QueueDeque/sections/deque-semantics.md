`Deque<E>` là **hàng đợi hai đầu (double-ended queue)**: thêm, đọc và xóa được ở cả đầu và cuối.

```text
             Deque
     first ← [A][B][C] → last
             ↑       ↑
        thao tác   thao tác
        đầu trái   đầu phải
```

```java
Deque<Order> pending = new ArrayDeque<>();

pending.offerLast(normalOrder);
pending.offerFirst(urgentOrder);

Order first = pending.pollFirst();
Order last = pending.pollLast();
```

Từ một quy ước này ta có thể biểu diễn hai mẫu phổ biến:

### Queue FIFO

```java
Deque<Order> queue = new ArrayDeque<>();
queue.offerLast(orderA);
queue.offerLast(orderB);

Order next = queue.pollFirst();
```

### Stack LIFO

```java
Deque<Order> stack = new ArrayDeque<>();
stack.push(orderA);
stack.push(orderB);

Order latest = stack.pop(); // orderB
```

Với mã nguồn mới, `Deque`/`ArrayDeque` thường được ưu tiên hơn `Stack` kiểu cũ vì quy ước hai đầu rõ ràng và không mang mô hình kế thừa cũ từ `Vector`.

Từ Java 21, `Deque` cũng là một `SequencedCollection`. Điều đó phản ánh đúng bản chất có đầu/cuối xác định và cung cấp nhóm thao tác thống nhất như đầu/cuối/đảo thứ tự bên cạnh các phương thức chuyên biệt của `Deque`.

Không nên kết luận rằng mọi thao tác của mọi `Deque` đều có cùng chi phí. `ArrayDeque` dùng cấu trúc mảng vòng có khả năng tăng dung lượng; `LinkedList` dùng nút liên kết. Chọn cách triển khai dựa vào kiểu sử dụng và đặc tính dữ liệu, không chỉ dựa vào cùng một interface.
