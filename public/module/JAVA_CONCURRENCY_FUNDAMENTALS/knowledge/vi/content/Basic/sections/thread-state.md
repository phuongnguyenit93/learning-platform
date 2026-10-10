Java định nghĩa sáu trạng thái trong `Thread.State`:

```text
NEW
RUNNABLE
BLOCKED
WAITING
TIMED_WAITING
TERMINATED
```

Không có enum state tên là `RUNNING`.

Một thread đang thực sự dùng CPU vẫn được JVM biểu diễn bằng `RUNNABLE`.

### NEW

Thread object đã được tạo nhưng chưa `start()`:

```java
Thread worker = new Thread(task);
System.out.println(worker.getState()); // NEW
```

### RUNNABLE

Thread đã được start và đang ở trạng thái có thể thực thi hoặc đang thực thi.

Java không tách riêng "ready" và "running" thành hai giá trị `Thread.State`.

### BLOCKED

Thread đang chờ lấy intrinsic monitor để đi vào một block hoặc method `synchronized`.

Ví dụ:

```text
Thread A giữ monitor X
        ↓
Thread B cố synchronized(X)
        ↓
Thread B = BLOCKED
```

`BLOCKED` có ý nghĩa rất cụ thể: chờ monitor lock của `synchronized`.

Không nên gọi mọi trường hợp "đang chờ" là `BLOCKED`.

### WAITING

Thread đang chờ vô thời hạn cho đến khi một điều kiện hoặc sự kiện khác làm nó có thể tiếp tục.

Một số API có thể đưa thread vào `WAITING`:

- `Object.wait()` không timeout;
- `Thread.join()` không timeout;
- `LockSupport.park()`.

Ví dụ với `wait()`:

```java
synchronized (monitor) {
    monitor.wait();
}
```

Thread đang gọi `wait()` phải được đánh thức bằng `notify()`, `notifyAll()`, interrupt hoặc một cơ chế phù hợp với API đang dùng.

Riêng `join()` có semantics khác: thread đang gọi `join()` chờ thread mục tiêu kết thúc.

### TIMED_WAITING

Thread đang chờ với một giới hạn thời gian.

Ví dụ:

- `Thread.sleep(...)`;
- `Object.wait(timeout)`;
- `Thread.join(timeout)`;
- `LockSupport.parkNanos(...)`.

### TERMINATED

Method `run()` đã hoàn thành hoặc kết thúc bởi exception không được xử lý.

Thread object vẫn tồn tại như một object Java, nhưng execution của thread đó đã kết thúc và không thể `start()` lại.

### Sơ đồ mental model

```text
new Thread(...)
      ↓
     NEW
      ↓ start()
   RUNNABLE
      ↓
 ┌────┼───────────────┐
 ↓    ↓               ↓
BLOCKED          WAITING / TIMED_WAITING
 └────┴──────┬────────┘
             ↓
          RUNNABLE
             ↓ run() kết thúc
         TERMINATED
```

Đây là mô hình khái niệm. Một thread có thể chuyển giữa `RUNNABLE` và các trạng thái chờ nhiều lần trong suốt vòng đời.

### Demo trong module

Tham khảo controller:

```text
BasicThreadController#threadLifeCycle()
```

Endpoint:

```text
GET /basic/thread-life-cycle
```

Demo mới chủ động điều khiển một worker đi qua lần lượt:

```text
NEW
→ RUNNABLE
→ TIMED_WAITING
→ BLOCKED
→ WAITING
→ TERMINATED
```

Service sử dụng các tín hiệu nội bộ để quan sát state thay vì chỉ dựa vào những khoảng `sleep()` ngẫu nhiên của request thread. Riêng `TIMED_WAITING` được tạo bằng một latch có timeout dài; caller quan sát state rồi chủ động release latch để worker tiếp tục sang bước `BLOCKED`. Vì vậy demo không phụ thuộc vào việc scheduler phải "bắt kịp" một cửa sổ sleep ngắn.

Khi chạy endpoint, response nên thể hiện đủ chuỗi:

```text
NEW -> NEW
RUNNABLE -> RUNNABLE
TIMED_WAITING -> TIMED_WAITING
BLOCKED -> BLOCKED
WAITING -> WAITING
TERMINATED -> TERMINATED
```

Điểm cần quan sát là mỗi state xuất hiện vì **một nguyên nhân cụ thể**:

- `TIMED_WAITING` do chờ có timeout;
- `BLOCKED` do chờ intrinsic monitor của `synchronized`;
- `WAITING` do `wait()` không timeout;
- `TERMINATED` sau khi `run()` kết thúc.

**Kết luận:** không nên gom mọi trạng thái "đang chờ" thành một khái niệm chung. `Thread.State` mô tả các loại chờ khác nhau với semantics khác nhau.
