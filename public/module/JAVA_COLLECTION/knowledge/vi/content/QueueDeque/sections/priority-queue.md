`PriorityQueue` vẫn thực hiện `Queue`, nhưng “phần tử tiếp theo” được quyết định bởi **độ ưu tiên thứ tự** thay vì thời điểm chèn.

```java
record Job(String name, int priority) {}

Queue<Job> jobs = new PriorityQueue<>(
        Comparator.comparingInt(Job::priority)
);

jobs.offer(new Job("normal", 50));
jobs.offer(new Job("urgent", 10));
jobs.offer(new Job("low", 90));

System.out.println(jobs.poll().name()); // urgent
```

Với comparator trên, độ ưu tiên nhỏ hơn đứng ở đầu Queue. Nếu không truyền comparator, phần tử phải có thứ tự tự nhiên phù hợp.

Mô hình tư duy triển khai là một **heap ưu tiên**:

```text
không duy trì toàn bộ dữ liệu theo thứ tự tuyến tính
        ↓
duy trì bất biến đủ để phần tử đầu luôn là phần tử ưu tiên nhất
        ↓
offer / poll điều chỉnh heap
```

Trong cách triển khai chuẩn, `offer` và `poll` có chi phí O(log n), còn xem phần tử đầu bằng `peek` là O(1).

Một bẫy quan trọng: **việc duyệt `PriorityQueue` không đảm bảo đi theo thứ tự ưu tiên**.

```java
for (Job job : jobs) {
    // Không được giả định thứ tự ở đây giống thứ tự poll().
}
```

Nếu cần lấy theo độ ưu tiên, hãy gọi `poll` lặp lại trên queue phù hợp hoặc tạo một bản sao khi cần giữ queue gốc:

```java
Queue<Job> copy = new PriorityQueue<>(jobs);
while (!copy.isEmpty()) {
    System.out.println(copy.poll());
}
```

Các phần tử có độ ưu tiên bằng nhau cũng không có cơ chế phân xử FIFO tự động. Nếu thứ tự khi bằng nhau quan trọng, comparator cần thêm tiêu chí, ví dụ số thứ tự.
