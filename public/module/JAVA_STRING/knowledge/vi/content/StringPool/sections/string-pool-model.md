String Pool lưu các tham chiếu chuẩn hóa cho một số String, đặc biệt là String literal và giá trị được `intern()`.

### VÌ SAO — vì sao String Pool tồn tại?

String xuất hiện cực nhiều trong mã nguồn: tên lớp, khóa, thông báo, đường dẫn, token, hằng số... Nếu literal giống nhau luôn tạo đối tượng mới, JVM sẽ giữ nhiều đối tượng có cùng nội dung mà không mang thêm ý nghĩa.

Vì String bất biến, Java có thể chuẩn hóa một số giá trị về cùng tham chiếu đại diện:

```text
những giá trị String bất biến có cùng nội dung
        ↓
chia sẻ một định danh tham chiếu chuẩn hóa an toàn
        ↓
String pool
```

```java
String a = "java";
String b = "java";
```

Vì hai literal có cùng nội dung được intern, `a` và `b` tham chiếu cùng một đối tượng String chuẩn trong pool.

Với String literal, đây không chỉ là một tối ưu ngẫu nhiên: literal và hằng String được intern theo hợp đồng của Java. Việc JVM lưu pool ở đâu trong bộ nhớ là chi tiết triển khai; người học không nên gắn mô hình tư duy với PermGen hay một cấu trúc dữ liệu nội bộ cụ thể.

Điểm cần nhớ là pool là cơ chế **tối ưu và chuẩn hóa định danh tham chiếu**, không thay đổi hợp đồng so sánh nội dung văn bản: muốn so nội dung vẫn dùng `equals`.

Pool cũng không phải một `Map` công khai mà ứng dụng có thể duyệt, xóa hay sửa trực tiếp. Hãy dùng nó như mô hình tư duy cho tham chiếu chuẩn hóa.
