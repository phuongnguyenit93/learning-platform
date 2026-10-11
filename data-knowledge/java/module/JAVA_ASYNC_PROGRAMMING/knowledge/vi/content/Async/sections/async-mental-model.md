Asynchronous mô tả quan hệ giữa caller và công việc:

```text
caller submit work
→ không nhất thiết chờ work hoàn thành ngay tại điểm submit
```

Nhưng worker thực thi công việc đó vẫn có thể block.

Ví dụ:

```java
CompletableFuture.supplyAsync(() -> blockingJdbcCall());
```

Caller có thể được giải phóng khỏi JDBC call, nhưng worker chạy lambda vẫn có thể bị block bởi JDBC.

Do đó cần phân biệt:

| Khái niệm | Câu hỏi |
| --- | --- |
| Async | Caller có phải chờ completion ngay không? |
| Parallel | Có nhiều work thực sự chạy đồng thời không? |
| Blocking | Thread thực thi có bị giữ trong lúc chờ không? |
| Non-blocking | Operation có tránh giữ Thread trong lúc chờ external event không? |
