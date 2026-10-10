Mỗi object Java có thể được dùng làm monitor cho `synchronized`.

```java
synchronized (lock) {
    // critical section
}
```

Khi một Thread đang giữ monitor, Thread khác muốn vào critical section sử dụng cùng monitor phải chờ.

`synchronized` cung cấp hai thứ quan trọng:

- mutual exclusion: tại một thời điểm chỉ Thread giữ monitor được chạy critical section;
- memory-consistency guarantee khi release/acquire cùng monitor.

### Method và block

```java
public synchronized void update() {
}
```

dùng monitor của `this`.

`static synchronized` dùng monitor của chính `Class` object:

```java
public static synchronized void updateGlobal() {
}
```

Vì vậy cần phân biệt:

```text
instance synchronized method
→ lock this

static synchronized method
→ lock MyClass.class
```

Hai instance khác nhau không chặn nhau chỉ vì cùng gọi một instance `synchronized` method; chúng chỉ cạnh tranh nếu thực sự dùng cùng monitor.

Trong khi:

```java
private final Object lock = new Object();

public void update() {
    synchronized (lock) {
    }
}
```

cho phép chọn monitor riêng và giữ scope khóa nhỏ hơn.

### Demo

Tham khảo:

```text
SynchronizationController#synchronizedCounter()
GET /synchronization/synchronized-counter
```

Nhiều worker cùng increment một counter nhưng method increment được `synchronized`.

Kết quả kỳ vọng:

```text
expected = actual
```

**Kết luận:** `synchronized` có thể biến critical section thành vùng mutual exclusion và tạo happens-before thông qua monitor acquire/release.
