Lan truyền có thể giữ nguyên exception. Khi một exception mới được tạo ra từ exception cũ, Java cho phép nối chúng bằng `cause` để không làm mất nguyên nhân.

Ví dụ:

```java
Order load(long orderId) {
    try {
        return jdbcLoad(orderId);
    } catch (SQLException ex) {
        throw new RuntimeException(
                "Cannot load order " + orderId,
                ex
        );
    }
}
```

Luồng:

```text
SQLException
→ exception gốc

RuntimeException
→ exception mới

cause
→ vẫn giữ SQLException để chẩn đoán
```

`RuntimeException` ở ví dụ này chỉ là lớp bọc để quan sát cơ chế. Điểm cần giữ là **chuỗi nguyên nhân (chaining)**: exception cũ phải được truyền vào làm `cause` của exception mới. Việc nên dùng kiểu lớp bọc nào và có nên chuyển đổi ở ranh giới trừu tượng hay không sẽ được học ở các chương về Custom Exception và ranh giới xử lý.
