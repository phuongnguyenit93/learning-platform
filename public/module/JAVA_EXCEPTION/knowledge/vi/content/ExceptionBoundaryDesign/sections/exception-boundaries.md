Tầng thấp thường dùng ngôn ngữ của cách triển khai:

```text
SQLException
IOException
SocketTimeoutException
```

Tầng cao hơn có thể cần ngôn ngữ của ứng dụng/miền nghiệp vụ:

```text
OrderRepositoryException
DocumentLoadException
PaymentUnavailableException
```

Ví dụ:

```java
Order loadOrder(long orderId) {
    try {
        return repository.load(orderId);
    } catch (SQLException ex) {
        throw new OrderRepositoryException(
                "Cannot load order " + orderId,
                ex
        );
    }
}
```

### VÌ SAO CẦN CHUYỂN ĐỔI EXCEPTION?

Nếu hợp đồng công khai của tầng service để lộ thẳng `SQLException`, bên gọi sẽ bị phụ thuộc vào công nghệ lưu trữ.

Sau này tầng repository đổi từ JDBC sang file hoặc API từ xa, ngôn ngữ lỗi mà bên gọi phải hiểu cũng bị kéo theo.

Việc chuyển đổi tạo ra một ranh giới:

```text
chi tiết triển khai
→ kết thúc tại ranh giới

ý nghĩa ở mức ứng dụng
→ tiếp tục đi ra bên gọi
```

Nhưng khi chuyển đổi phải giữ `cause`; nếu không, mức trừu tượng đẹp hơn nhưng thông tin chẩn đoán lại kém đi.

### Đừng bọc exception ở mọi tầng

Không cần:

```text
SQLException
→ RepositoryException
→ ServiceException
→ ControllerException
```

nếu mỗi lớp bọc chỉ đổi tên.

Chỉ bọc khi tầng mới thực sự thêm một trong các giá trị:

- ý nghĩa ở mức trừu tượng mới;
- nhóm xử lý mới;
- ngữ cảnh hữu ích;
- hợp đồng công khai ổn định.

Một chuỗi kiểu:

```text
IOException
→ MyIOException
→ ServiceIOException
→ ControllerIOException
```

không tạo thêm giá trị nếu mỗi lớp chỉ đổi tên cùng một lỗi.

### Giữ nguyên hay bọc lại?

Nếu mức trừu tượng không đổi, ném lại exception cũ có thể hợp lý:

```java
catch (IOException ex) {
    audit(ex);
    throw ex;
}
```

Nếu mức trừu tượng thay đổi, bọc bằng một kiểu phù hợp và giữ nguyên nhân có thể rõ hơn:

```java
catch (IOException ex) {
    throw new OrderLoadException("Cannot load order file", ex);
}
```

Không nên tạo lớp bọc chỉ vì “đã bắt exception thì phải ném exception mới”.
