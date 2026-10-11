Runtime area có giới hạn tài nguyên, nên JVM specification định nghĩa các ranh giới lỗi quan trọng.

**StackOverflowError** thường gắn với việc thread cần thêm stack/frame nhưng vượt giới hạn stack có thể cấp.

```java
static void recurse() {
    recurse();
}
```

điển hình sẽ tăng depth cho tới khi stack không còn đáp ứng được.

**OutOfMemoryError** rộng hơn “Java heap full”. Nó có thể xuất hiện khi JVM không thể cấp đủ memory cho heap hoặc một số runtime structures/resources cần thiết.

Rule thực tế:

```text
error name
≠ đủ để xác định nguyên nhân production
```

Phân loại cơ chế thuộc JVM; thu thập heap dump/NMT/JFR và root-cause troubleshooting thuộc Runtime Diagnostics.
