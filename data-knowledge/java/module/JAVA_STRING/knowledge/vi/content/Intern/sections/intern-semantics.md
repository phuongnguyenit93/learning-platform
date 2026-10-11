Khi gọi:

```java
String canonical = value.intern();
```

JVM trả về tham chiếu đại diện trong String Pool cho chuỗi có cùng nội dung.

Mô hình tư duy:

```text
value.intern()
        │
        ├── pool đã có String equals(value)
        │      → trả tham chiếu chuẩn hóa đã có trong pool
        │
        └── chưa có
               → value trở thành đại diện chuẩn hóa
               → trả tham chiếu chuẩn hóa
```

Điều này không thay đổi nội dung của `value` và cũng không làm `String` trở nên có thể thay đổi. `intern()` chỉ liên quan tới **định danh tham chiếu và chuẩn hóa**, không thay đổi ngữ nghĩa so sánh nội dung.

### VÌ SAO intern() tồn tại?

`intern()` cho phép mã ứng dụng yêu cầu một tham chiếu chuẩn cho các String có cùng nội dung. Nó có thể hữu ích trong một số khối lượng xử lý có tập giá trị lặp lại nhiều và số lượng giá trị khác nhau được kiểm soát.

Nếu mục tiêu chỉ là “hai chuỗi có cùng nội dung?”, `equals` đã là API đúng; không cần gọi `intern()` trước khi so sánh.
