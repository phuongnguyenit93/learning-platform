Một `Throwable` thường chứa bốn mảnh thông tin quan trọng:

- **kiểu** — loại lỗi, ví dụ `IOException`;
- **thông điệp** — thông tin mô tả cụ thể;
- **stack trace** — các khung ngăn xếp (stack frame) giúp biết đường gọi dẫn tới lỗi;
- **cause** — exception ở tầng thấp hơn đã dẫn tới exception hiện tại.

Để chỉ quan sát quan hệ `cause` mà chưa cần biết về Custom Exception, dùng một lớp bọc quen thuộc:

```java
try {
    return repository.load(orderId);
} catch (IOException ex) {
    throw new RuntimeException("Cannot load order " + orderId, ex);
}
```

Khi đó:

```text
RuntimeException
message = Cannot load order 42
cause
  ↓
IOException
message = connection reset
```

`RuntimeException` ở đây chỉ dùng để minh họa cấu trúc `cause`, không phải khuyến nghị rằng mọi `IOException` nên được bọc bằng `RuntimeException`. Thiết kế Custom Exception và quyết định chuyển đổi lỗi sẽ được học ở các chương sau.

Bên ngoài có thể đọc chuỗi nguyên nhân:

```java
Throwable current = ex;

while (current != null) {
    System.out.println(current.getClass().getSimpleName()
            + ": " + current.getMessage());
    current = current.getCause();
}
```

### Stack trace nói cho ta điều gì?

Một stack trace thường cho thấy:

```text
nơi Throwable được tạo / ghi stack
        ↓
phương thức đang thực thi
        ↓
bên gọi
        ↓
bên gọi của bên gọi
```

Nó là dữ liệu chẩn đoán, không phải hợp đồng ổn định để logic nghiệp vụ phân tích bằng chuỗi. Việc refactor có thể thay đổi tên phương thức, số dòng và khung ngăn xếp.

Ngoài ra, đừng tái sử dụng cùng một đối tượng exception như một “hằng lỗi”. Stack trace thường được ghi khi `Throwable` được tạo hoặc điền stack trace; tái sử dụng cùng đối tượng có thể khiến thông tin vị trí trở nên gây hiểu nhầm.

### GHI NHỚ

```text
Throwable
= một đối tượng mang thông tin
+ một tín hiệu làm thay đổi luồng điều khiển
```

Chương tiếp theo phân biệt **checked** và **unchecked**: khi nào trình biên dịch biến khả năng phát sinh lỗi thành một phần bắt buộc của hợp đồng phương thức?
