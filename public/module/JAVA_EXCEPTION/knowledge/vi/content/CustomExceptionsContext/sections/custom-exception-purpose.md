Ngoại lệ tùy chỉnh hữu ích khi nó:

- diễn đạt lỗi bằng ngôn ngữ của miền nghiệp vụ/ứng dụng;
- che chi tiết triển khai của tầng thấp;
- cho phép bên gọi bắt một nhóm lỗi có cùng chính sách xử lý;
- mang ngữ cảnh có cấu trúc mà thông điệp thuần chuỗi không đủ;
- tạo một hợp đồng ổn định hơn so với exception của thư viện/hạ tầng phía dưới.

Ví dụ tầng repository có thể thay đổi từ file sang cơ sở dữ liệu theo thời gian. Tầng service không muốn bên gọi phụ thuộc vào `IOException` hay `SQLException`.

```java
try {
    return repository.load(orderId);
} catch (IOException ex) {
    throw new OrderLoadException(orderId, ex);
}
```

Bên gọi nhìn thấy:

```text
OrderLoadException
```

thay vì phải biết tầng repository đang dùng file.

### Khi nào KHÔNG cần?

Không nên tạo:

```java
class InvalidArgumentForOrderException extends RuntimeException {
}
```

chỉ để thay cho `IllegalArgumentException` nếu kiểu mới không bổ sung:

- ý nghĩa nghiệp vụ;
- ngữ cảnh có cấu trúc;
- chính sách xử lý;
- ranh giới trừu tượng.

Nhiều lớp exception chỉ khác tên làm API khó đọc hơn mà không tăng khả năng biểu đạt.

### Checked hay unchecked cho ngoại lệ tùy chỉnh?

Cả hai đều hợp lệ.

Unchecked:

```java
class OrderLoadException extends RuntimeException {
}
```

Checked:

```java
class OrderLoadException extends Exception {
}
```

Lựa chọn quay lại câu hỏi của chương Checked/Unchecked:

```text
Có muốn trình biên dịch buộc mọi bên gọi bắt hoặc khai báo lỗi này không?
```

Đừng chọn chỉ vì “custom exception thì phải extends RuntimeException” hoặc “exception nghiệp vụ thì phải extends Exception”.
