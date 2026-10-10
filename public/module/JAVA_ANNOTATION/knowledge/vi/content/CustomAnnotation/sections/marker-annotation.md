Annotation đánh dấu là annotation interface **không có phần tử**:

```java
public @interface Audited {
}
```

Cách sử dụng:

```java
@Audited
class PaymentService {
}
```

Ý nghĩa thường chỉ dựa trên việc Annotation có xuất hiện hay không:

```text
có @Audited
→ tham gia vào một quy tắc

không có @Audited
→ không tham gia
```

Cần phân biệt kiểu Annotation đánh dấu với **cú pháp viết dạng marker**. Một Annotation có các phần tử nhưng tất cả đều có giá trị mặc định vẫn có thể được viết như:

```java
@Feature
```

nhưng kiểu Annotation đó không phải Annotation đánh dấu thực sự vì cấu trúc vẫn có phần tử.

Marker phù hợp khi siêu dữ liệu thật sự chỉ cần biểu diễn một trạng thái có/không. Nếu bắt đầu xuất hiện nhiều biến thể, nên dùng một cấu trúc có nghĩa thay vì tạo hàng loạt marker gần giống nhau.
