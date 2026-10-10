Một lần sử dụng Annotation bắt đầu bằng `@` và tên Annotation:

```java
@Audit(action = "TRANSFER", level = 2)
void transfer() {
}
```

`action` và `level` là **phần tử Annotation (annotation elements)**. Chúng giống các giá trị có tên trong cấu trúc của Annotation, không phải field có thể thay đổi tùy ý.

Các dạng cú pháp thường gặp:

```java
@Audit(action = "TRANSFER", level = 2) // nhiều phần tử
@Role("ADMIN")                         // cách viết gọn cho phần tử tên value
@Transactional                         // cách viết dạng marker
```

Nếu Annotation có đúng một phần tử cần truyền và phần tử đó tên `value`, có thể bỏ `value =`:

```java
@Role(value = "ADMIN")
@Role("ADMIN")
```

Hai cách trên tương đương.

Giá trị của Annotation phải hợp lệ theo type của phần tử và theo quy tắc tại thời điểm biên dịch của Java. Ví dụ:

```java
@Retry(maxAttempts = 3)
```

Nếu phần tử `maxAttempts()` có type `int`, truyền một `String` sẽ bị trình biên dịch từ chối.

### Annotation lồng nhau và mảng

Phần tử có thể chứa Annotation khác hoặc mảng:

```java
@Route(
    path = "/orders",
    roles = {"USER", "ADMIN"},
    cache = @CachePolicy(seconds = 30)
)
```

Với mảng một phần tử, Java cho phép bỏ `{}` khi sử dụng Annotation:

```java
@Roles({"ADMIN"})
@Roles("ADMIN")
```

Đây chỉ là cú pháp viết gọn; mô hình của phần tử vẫn là mảng.

### Chuyển sang các Annotation có sẵn

Sau khi đã hiểu Annotation là siêu dữ liệu có cấu trúc và cần một thành phần đọc, bước tiếp theo là nhìn vào những Annotation Java cung cấp sẵn. Những Annotation như `@Override` cho thấy ý định của lập trình viên có thể được biến thành điều trình biên dịch kiểm tra được.
