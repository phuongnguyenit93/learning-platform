JVM không bắt buộc bytecode luôn được thực thi theo đúng một kỹ thuật. Một implementation có thể dùng interpreter, compiler hoặc kết hợp nhiều tầng miễn Java-level semantics vẫn được giữ.

HotSpot điển hình dùng mô hình **adaptive execution**:

```text
bytecode
   ↓
interpreter chạy trước
   ↓
runtime profiling thu thập hành vi
   ↓
hot code được compile
   ↓
optimized native code
```

Lợi ích là runtime không phải compile toàn bộ ứng dụng trước khi chạy, đồng thời có thể dùng thông tin thực tế của workload để tối ưu code quan trọng.

Execution engine vì thế nên được hiểu là subsystem biến bytecode semantics thành machine execution, không phải một class/API mà ứng dụng gọi trực tiếp.
