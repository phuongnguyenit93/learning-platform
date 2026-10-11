Java không có một kiểu hàm riêng biệt ở cấp ngôn ngữ. Thay vào đó, phương thức nhận hoặc trả về hành vi thông qua một giao diện hàm như `Function`, `Predicate`, `Consumer` hoặc một giao diện hàm do ứng dụng tự định nghĩa.

Nhờ vậy, Java vẫn hỗ trợ cách lập trình bậc cao theo hướng thực dụng: hành vi có thể được truyền như một giá trị, còn giao diện hàm giữ rõ hợp đồng về tham số và kết quả.

```java
static <T, R> R apply(T value, Function<T, R> operation) {
    return operation.apply(value);
}

String result = apply(" java ", String::trim);
```

Phương thức quyết định *khi nào* hành vi chạy. Bên gọi quyết định *hành vi nào* được truyền vào.
