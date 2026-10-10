`Queue<E>` mô tả cấu trúc mà thao tác chính là **đưa phần tử vào** và **lấy phần tử ở đầu hàng đợi ra để xử lý**. Với Queue FIFO thông thường, phần tử vào trước được lấy ra trước:

```text
offer A → [A]
offer B → [A, B]
offer C → [A, B, C]
poll    → A
poll    → B
```

```java
Queue<Order> pending = new ArrayDeque<>();
pending.offer(orderA);
pending.offer(orderB);
pending.offer(orderC);

Order next = pending.poll(); // orderA
```

FIFO là mô hình phổ biến, nhưng `Queue` không bắt buộc mọi cách triển khai phải dùng thứ tự chèn. `PriorityQueue` là ví dụ quan trọng: phần tử ở đầu được quyết định bởi thứ tự ưu tiên.

Vì vậy, khi một API nhận `Queue<Order>`, điều bên gọi có thể tin là có các thao tác queue như `offer`, `poll`, `peek`; thứ tự cụ thể còn phụ thuộc quy ước của cách triển khai.

Với Queue xử lý thông thường, `ArrayDeque` thường là cách triển khai phù hợp: không có dung lượng cố định theo API thông thường, thao tác hai đầu hiệu quả, và không cho phép `null`.

Không nên dùng `null` làm phần tử của Queue ngay cả với cách triển khai có thể chấp nhận nó, vì `poll` và `peek` dùng `null` làm giá trị đặc biệt khi Queue rỗng. Tách “dữ liệu thật” khỏi “không có phần tử” làm mã nguồn rõ ràng hơn.
