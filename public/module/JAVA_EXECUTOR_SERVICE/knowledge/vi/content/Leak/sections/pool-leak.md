Một `ExecutorService` tạo ra các worker Thread và thường cần explicit shutdown nếu nó không được framework/container quản lý.

Pattern nguy hiểm:

```java
void handleRequest() {
    ExecutorService pool = Executors.newFixedThreadPool(10);
    pool.submit(...);
    // quên shutdown
}
```

Mỗi request có thể tạo thêm pool/worker mới.

Tham khảo:

```text
LeakController#poolLeakPattern()
GET /leak/pool-pattern
```

Demo ghi nhận executor chưa shutdown ở giữa experiment, sau đó cleanup bằng `shutdown/awaitTermination`.
