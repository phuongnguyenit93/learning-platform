Class isolation chưa đủ nếu plugin vẫn làm rò rỉ tài nguyên ra ngoài boundary.

Các tài nguyên thường giữ plugin sống:

- non-daemon thread;
- executor/scheduler;
- `ThreadLocal` trên host thread;
- static registry/listener;
- shutdown hook;
- cache ở host giữ instance/class;
- file/socket/native resource còn mở;
- thread context class loader trỏ vào plugin loader.

Ví dụ plugin tạo executor thì phải có cleanup:

```java
final class PdfPlugin implements AutoCloseable {
    private final ExecutorService executor = Executors.newFixedThreadPool(2);

    @Override
    public void close() {
        executor.shutdown();
    }
}
```

Host cũng phải ngừng giữ reference tới provider, class, loader và metadata object nếu muốn loader trở nên collectible.

Isolation boundary vì vậy là **class + tài nguyên + thread + quyền sở hữu reference**, không chỉ là tách folder/JAR.
