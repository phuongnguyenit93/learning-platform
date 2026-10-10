Ta có thể dùng `WeakReference` để viết một thí nghiệm có giới hạn:

`WeakReference<T>` giữ một tham chiếu **không đủ mạnh để tự ngăn object được GC thu hồi**. Vì vậy nó hữu ích để quan sát “loader còn sống không?” mà không vô tình biến chính biến quan sát thành một strong reference giữ loader sống.

```java
ClassLoader loader = createPluginLoader();
Class<?> pluginClass =
        loader.loadClass("com.example.plugins.PaymentPlugin");

WeakReference<ClassLoader> loaderRef =
        new WeakReference<>(loader);

pluginClass = null;
loader = null;

System.gc(); // chỉ là yêu cầu, không phải đảm bảo

System.out.println(loaderRef.get());
```

Nếu `loaderRef.get()` vẫn khác `null`, chưa thể kết luận ngay là leak: GC có thể chưa chạy/thu hồi loader. Ngược lại, nếu sau áp lực GC có kiểm soát và công cụ chẩn đoán loader luôn còn reachable, cần tìm chuỗi tham chiếu.

> **Nâng cao — chẩn đoán runtime:** với HotSpot/JDK 21, unified logging có thể hỗ trợ việc quan sát:

```text
-Xlog:class+load=info,class+unload=info
```

Đây là cơ chế chẩn đoán của một cách triển khai JVM, không phải bảo đảm của ngôn ngữ Java. Khi chẩn đoán trong môi trường thực tế còn có thể dùng heap dump, JFR hoặc profiler phù hợp để tìm đường tham chiếu từ GC root tới loader bị giữ lại.

Checklist suy luận hữu ích hơn việc gọi `System.gc()` lặp lại:

```text
plugin đã dừng thật chưa?
→ thread/executor còn hoạt động?
→ TCCL đã được khôi phục?
→ ThreadLocal đã được xóa?
→ listener/provider đã được gỡ đăng ký?
→ parent/cache toàn cục còn giữ Class/instance?
→ loader/JAR handle đã được đóng khi cần?
→ còn tham chiếu mạnh tới loader?
```
