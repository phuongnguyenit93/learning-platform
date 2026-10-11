### 1. Luồng xử lý bị ẩn

Mã nguồn như:

```java
@Transactional
@Audited
@Secured
void transfer() {
}
```

có thể kéo theo nhiều hành vi bên ngoài thân method. Điều này không sai, nhưng lập trình viên phải biết framework hoặc thành phần nào đọc từng Annotation và thứ tự/điều kiện xử lý của chúng.

Nếu hành vi quan trọng nhưng không thể lần ra từ quy tắc hoặc tài liệu, Annotation đang làm mã nguồn khó suy luận.

### 2. Phụ thuộc chặt vào framework

Annotation do framework sở hữu có thể làm class nhìn “nhẹ” hơn về mã nguồn nhưng vẫn tạo phụ thuộc mạnh vào ngữ nghĩa của framework.

Hãy phân biệt:

```text
Cơ chế Annotation của Java
≠
hành vi framework được kích hoạt bởi Annotation
```

### 3. Chọn sai `@Retention`

```text
thành phần đọc lúc chạy
+ chính sách SOURCE
→ siêu dữ liệu biến mất trước khi thành phần đọc có thể đọc
```

Ngược lại, dùng `RUNTIME` cho mọi Annotation chỉ vì “an toàn hơn” làm quy tắc rộng hơn mức cần thiết và có thể khiến người đọc hiểu nhầm rằng kiểm tra bằng Reflection lúc chạy là một phần bắt buộc của thiết kế.

### 4. Chọn `@Target` quá rộng

Nếu Annotation chỉ có ý nghĩa trên method nhưng lại cho phép cả `FIELD`, `TYPE`, `PARAMETER`..., trình biên dịch không còn giúp chặn những vị trí sử dụng vô nghĩa.

### 5. Biến Annotation thành một ngôn ngữ cấu hình lớn

Một Annotation có hàng chục phần tử, nhiều giá trị đặc biệt, nhiều cờ tương tác và quy tắc ghi đè phức tạp có thể khó hiểu hơn một đối tượng cấu hình có type rõ ràng.

Ví dụ:

```java
@Feature(
        mode = Mode.AUTO,
        fallback = true,
        cache = true,
        retries = 3,
        async = true,
        strict = false
)
```

Khi siêu dữ liệu bắt đầu mô tả một thuật toán phức tạp hoặc nhiều cờ tương tác, một type thực, builder hoặc đối tượng cấu hình thường làm hành vi rõ hơn và dễ kiểm thử hơn.

### 6. Giá trị mặc định làm thay đổi quy tắc theo thời gian

Giá trị mặc định thuộc kiểu Annotation. Khi thành phần đọc xử lý một cách sử dụng không ghi giá trị tường minh, thay đổi giá trị mặc định của kiểu Annotation có thể làm giá trị quan sát được thay đổi. Vì vậy giá trị mặc định không chỉ là cú pháp tiện lợi; nó là một phần của quy tắc tương thích.
