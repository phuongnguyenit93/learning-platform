Spring Boot hỗ trợ virtual-thread-oriented task execution khi bật property phù hợp, ví dụ trong Boot version hỗ trợ:

```properties
spring.threads.virtual.enabled=true
```

Nhưng không nên diễn giải thành:

> bật property này thì mọi Thread trong application đều trở thành virtual thread.

Custom executor, library riêng, scheduler riêng hoặc code tự tạo platform Thread vẫn có lifecycle/execution strategy của chúng.

Khi cần chắc chắn, quan sát executor/thread thực tế thay vì suy ra từ property một cách tuyệt đối.

Do virtual threads là daemon threads, application chỉ còn daemon threads có thể làm JVM exit dù vẫn còn background work dự kiến. Với Spring Boot, khi application cần được giữ sống độc lập với non-daemon worker, có thể dùng `spring.main.keep-alive=true` để Boot giữ JVM sống. Điểm này đặc biệt đáng chú ý với scheduler/background component khi virtual threads được bật.
