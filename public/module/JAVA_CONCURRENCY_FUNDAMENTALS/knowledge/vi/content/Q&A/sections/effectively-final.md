Đây trước hết là **Java language/closure semantics**, không phải vì JVM "bắt local variable phải thread-safe".

Ví dụ hợp lệ:

```java
int taskId = i;
executor.execute(() -> use(taskId));
```

nếu `taskId` không bị gán lại sau khi khởi tạo.

Lambda capture value/reference của local variable theo rule effectively-final để tránh semantics mơ hồ của mutable local stack variable sau khi enclosing method tiếp tục/thoát.

Điều đó không làm object được capture trở thành immutable:

```java
final List<String> list = new ArrayList<>();
```

reference không đổi nhưng nội dung list vẫn mutable.
