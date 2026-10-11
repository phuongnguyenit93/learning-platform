Đây là kiến thức nền tảng nhất khi làm việc trực tiếp với `Thread`.

Giả sử có:

```java
Thread worker = new Thread(task, "worker-thread");
```

### Gọi run()

```java
worker.run();
```

Đây chỉ là một lời gọi method Java thông thường.

Không có thread mới được start.

`task` chạy ngay trên thread đang gọi `run()`.

```text
HTTP request thread
      ↓
worker.run()
      ↓
task vẫn chạy trên HTTP request thread
```

### Gọi start()

```java
worker.start();
```

`start()` yêu cầu JVM khởi động execution của Thread đó. Sau đó JVM sẽ gọi `run()` trên thread mới.

```text
HTTP request thread
      │
      └── worker.start()
              ↓
        worker-thread
              ↓
            run()
```

Vì vậy:

```text
run()   → method call bình thường
start() → bắt đầu lifecycle của một Thread mới
```

Một object `Thread` chỉ được `start()` một lần. Nếu gọi `start()` lần thứ hai sau khi nó đã được start, JVM ném `IllegalThreadStateException`.

### Demo trong module

Tham khảo controller:

```text
BasicThreadController#startVsRun()
```

Endpoint:

```text
GET /basic/start-vs-run
```

Demo chạy cùng một `Runnable` theo hai cách:

1. gọi trực tiếp `run()`;
2. tạo Thread và gọi `start()`.

Khi chạy, hãy so sánh tên thread:

```text
run() trực tiếp
→ task chạy trên caller/request thread

start()
→ task chạy trên basic-start-worker
```

Điểm cần quan sát không phải thứ tự log, mà là **thread nào đang thực thi `run()`**.

**Kết luận:** gọi `run()` chỉ là gọi method bình thường; gọi `start()` mới bắt đầu lifecycle của một Thread riêng.
