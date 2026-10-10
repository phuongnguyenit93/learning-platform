Initialization là nơi plugin nhận context/config và tạo tài nguyên cần thiết.

Ví dụ contract lifecycle riêng:

```java
public interface Plugin {
    void initialize(PluginContext context) throws PluginException;
    void start() throws PluginException;
}
```

Tách `initialize` và `start` hữu ích khi host muốn:

1. construct + validate tất cả plugin;
2. sau đó mới publish/activate đồng loạt.

Initialization nên idempotent hay one-shot phải được contract quy định rõ. Đừng mặc định gọi lặp an toàn.

Nếu provider constructor làm quá nhiều việc (network call, thread creation, mở file lớn), discovery có thể vô tình gây side effect. Với plugin phức tạp, giữ constructor nhẹ và chuyển work sang lifecycle hook thường dễ kiểm soát hơn.

Startup failure nên giữ original cause và plugin identity để observability/debugging rõ ràng.
