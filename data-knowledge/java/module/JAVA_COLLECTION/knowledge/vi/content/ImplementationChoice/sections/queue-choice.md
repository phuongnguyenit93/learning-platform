Nếu cần FIFO/LIFO hoặc thao tác hai đầu, `ArrayDeque` thường là lựa chọn đa dụng:

- thêm/xóa đầu và cuối hiệu quả;
- dùng được như Queue qua `offerLast/pollFirst`;
- dùng được như stack qua `push/pop`;
- không cho `null`.

`LinkedList` cũng triển khai `Deque` và `List`. Nó phù hợp khi thật sự cần quy ước/hành vi của danh sách liên kết; việc dùng nó chỉ vì cần Queue thường không đem lại lợi ích rõ ràng so với `ArrayDeque` và có thêm chi phí cho các nút.

`PriorityQueue` giải một bài toán khác: luôn lấy phần tử có **độ ưu tiên cao nhất theo quy tắc sắp xếp** ở đầu Queue — tức phần tử nhỏ nhất theo comparator, trừ khi comparator được đảo thứ tự.

```java
PriorityQueue<Order> queue = new PriorityQueue<>(
        Comparator.comparingInt(Order::totalCents).reversed()
);

queue.offer(new Order(1, 1, 20_000));
queue.offer(new Order(2, 2, 10_000));

System.out.println(queue.peek().id()); // 1
```

Iterator của `PriorityQueue` **không cam kết** trả mọi phần tử theo thứ tự ưu tiên. Muốn lấy lần lượt theo độ ưu tiên, phải `poll()`. Các phần tử có cùng độ ưu tiên cũng không có thứ tự ổn định mặc định.
