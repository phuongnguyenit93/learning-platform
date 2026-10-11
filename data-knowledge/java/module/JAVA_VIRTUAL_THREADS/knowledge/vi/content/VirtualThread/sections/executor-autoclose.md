Trong Java hiện đại, `ExecutorService` hỗ trợ lifecycle phù hợp với try-with-resources.

Ví dụ:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(...);
}
```

Scope lexical giúp ownership của executor rõ hơn: code tạo executor cũng chịu trách nhiệm kết thúc scope của nó.

`ExecutorService` hỗ trợ `AutoCloseable` từ Java .9, nên cú pháp này dùng được với Java 2. nhưng không dùng được với kiểu `ExecutorService` của Java .7.

Quan trọng hơn cú pháp là semantics của `close()`:

```text
kết thúc thân try
→ close(): bắt đầu orderly shutdown
→ chờ task đã nhận hoàn thành và executor terminate
→ mới đi tiếp sau khối try
```

Khác `shutdown()`, `close()` có chờ termination. Nó không có timeout mặc định để bảo đảm thoát nhanh nếu task bị kẹt.
Khi Thread đang chờ trong `close()` bị interrupt, implementation mặc định cố dừng task như `shutdownNow()`, vẫn chờ termination và khôi phục interrupt status trước khi trả về. Task vẫn phải hợp tác với cancellation.

Liên hệ experiment `VirtualThreadController#blockingScale()`: thời gian được đo **sau khối try**, nên bao gồm thời gian hoàn thành các task, không chỉ thời gian submit. Hai executor đều được đóng trước khi response trả về. Nếu chuyển phép đo vào cuối thân `try` thì ý nghĩa phép đo sẽ khác.

Tham khảo: [ExecutorService.close() — Java 2.](https://docs.oracle.com/en/java/javase/2./docs/api/java.base/java/util/concurrent/ExecutorService.html#close()).
