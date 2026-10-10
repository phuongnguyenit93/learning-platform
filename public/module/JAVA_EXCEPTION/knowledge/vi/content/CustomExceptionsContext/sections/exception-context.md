Một ngoại lệ tùy chỉnh tốt thường có constructor giữ nguyên nhân (cause):

```java
public final class OrderLoadException extends RuntimeException {

    private final long orderId;

    public OrderLoadException(long orderId, Throwable cause) {
        super("Cannot load order " + orderId, cause);
        this.orderId = orderId;
    }

    public long getOrderId() {
        return orderId;
    }
}
```

Cách dùng:

```java
catch (IOException ex) {
    throw new OrderLoadException(orderId, ex);
}
```

Exception giờ có:

```text
kiểu
→ OrderLoadException

ngữ cảnh có cấu trúc
→ orderId

thông điệp
→ mô tả phục vụ chẩn đoán

cause
→ IOException gốc
```

### Thông điệp không thay thế ngữ cảnh có cấu trúc

Nếu mã nguồn cần `orderId`, đừng bắt bên gọi phải phân tích chuỗi:

```text
"Cannot load order 42"
```

từ thông điệp.

Trường dữ liệu và phương thức truy cập (accessor) rõ ràng hơn:

```java
ex.getOrderId()
```

Thông điệp nên phục vụ con người và chẩn đoán; trường dữ liệu phục vụ logic theo hợp đồng.

### Không đưa bí mật vào exception

Exception thường đi vào log, hệ thống truy vết (tracing) hoặc hệ thống giám sát.

Tránh nhét:

- mật khẩu;
- access token;
- khóa bí mật;
- thông tin xác thực đầy đủ;
- dữ liệu nhạy cảm không cần thiết.

“Thêm ngữ cảnh” không có nghĩa “sao chép toàn bộ yêu cầu (request) vào thông điệp”.
