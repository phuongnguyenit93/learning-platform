Parent delegation giúp core classes được tìm ở phía trên chuỗi trước, nhưng JVM/JDK còn có constraint runtime để bảo vệ namespace nền tảng.

Ví dụ, một custom loader không thể bình thường tự định nghĩa class mới trong namespace `java.*`. Nếu nó cố đưa bytes của một class giả mang tên `java.lang.String` vào bước định nghĩa class, ClassLoader contract sẽ từ chối với `SecurityException`.

API `defineClass` cụ thể sẽ được học ở chương `CustomClassLoader`; ở đây chỉ cần giữ ranh giới: **parent delegation là chính sách lookup, còn ClassLoader/JVM vẫn có thêm constraint để child loader không chiếm namespace nền tảng**.

Điều người học cần giữ:

```text
parent delegation
→ chính sách lookup mặc định
→ giúp dùng lại type ở parent

constraint runtime/package
→ thêm ranh giới để custom loader không chiếm core namespace tùy ý
```

Với hệ thống plugin, API dùng chung nên đặt ở parent và plugin implementation ở child. Đây là bước chuyển tự nhiên sang chương Custom ClassLoader: **khi parent không có implementation, child sẽ lấy bytes ở nguồn riêng và định nghĩa class bằng cách nào?**
