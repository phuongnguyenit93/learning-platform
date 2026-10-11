Java 2. cung cấp:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(task);
}
```

Mỗi task được thực thi trong một virtual thread mới.

Không cần pool virtual thread theo cách pool platform thread truyền thống, vì virtual thread được thiết kế để tạo nhiều và không reuse như worker pool để tiết kiệm OS thread.

Tham khảo:

```text
VirtualThreadController#blockingScale()
GET /virtual-thread/blocking-scale
```

Demo so sánh một lượng nhỏ sleep-based blocking task:

- fixed platform pool có .0 workers;
- virtual-thread-per-task executor.

Timing chỉ mang tính minh họa, **không phải benchmark chuẩn**. `sleep` được dùng để làm rõ concurrency shape, không để kết luận performance production.
