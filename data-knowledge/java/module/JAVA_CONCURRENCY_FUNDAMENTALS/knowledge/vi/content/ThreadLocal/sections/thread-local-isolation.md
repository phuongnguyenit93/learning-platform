Ví dụ:

```java
ThreadLocal<String> requestId = new ThreadLocal<>();

requestId.set("REQ-123");
try {
    // code cùng Thread có thể requestId.get()
} finally {
    requestId.remove();
}
```

Hai Thread sử dụng cùng một `ThreadLocal` object có thể thấy hai value khác nhau.

Tham khảo:

```text
ThreadLocalController#isolation()
GET /context/isolation
```

Experiment tạo hai Thread, mỗi Thread set một request id khác nhau rồi đọc lại value của chính nó.

**Kết luận:** isolation đến từ Thread-local association, không phải từ lock hay visibility synchronization trên một shared value.
