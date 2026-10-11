`Supplier<T>` tạo ra một giá trị mà không nhận tham số qua phương thức hàm:

```java
T get();
```

Ví dụ:

```java
Supplier<UUID> idFactory = UUID::randomUUID;
UUID id = idFactory.get();
```

Ý tưởng quan trọng là **trì hoãn việc tạo giá trị**. Khi truyền `Supplier<T>`, ta truyền cách tạo ra giá trị thay vì một giá trị đã được tính sẵn.

```java
Supplier<String> expensiveMessage = () -> buildExpensiveMessage();
```

Việc `get()` có được gọi hay không và gọi lúc nào do mã nhận hàm cung cấp quyết định. Mô hình này hữu ích cho cơ chế tạo, phương án thay thế chỉ tính khi cần, bộ cung cấp dữ liệu kiểm thử và các trường hợp tạo dữ liệu theo yêu cầu.
