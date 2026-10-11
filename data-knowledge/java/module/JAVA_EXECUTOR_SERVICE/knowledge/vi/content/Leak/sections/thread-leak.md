Thread leak xảy ra khi Thread được tạo nhưng không có termination/lifecycle strategy phù hợp và tiếp tục sống lâu hơn owner mong muốn.

Ví dụ nguy hiểm:

```java
new Thread(() -> {
    while (true) {
        doSomething();
    }
}).start();
```

nếu không có cancellation path và owner không còn kiểm soát reference/lifecycle.

Thread sống có thể giữ:

- native thread resources;
- stack;
- object reachable từ stack/thread-local;
- classloader/context reference;
- CPU nếu loop hoạt động.

### Demo bounded

Tham khảo:

```text
LeakController#threadLeakPattern()
GET /leak/thread-pattern
```

Worker được cố tình giữ ở trạng thái chờ để quan sát:

```text
aliveBeforeCleanup = true
```

sau đó experiment release worker và join:

```text
aliveAfterCleanup = false
```

**Kết luận:** demo cho thấy pattern leak mà không thực sự để lại leaked Thread.
