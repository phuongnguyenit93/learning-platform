Khi một toán hạng là String trong ngữ cảnh nối chuỗi, Java tạo ra một kết quả String biểu diễn nội dung đã nối.

```java
String message = "Hello " + name;
```

String cũ không bị sửa tại chỗ; kết quả là một giá trị String mới về mặt ngữ nghĩa.

### Chuyển đổi sang String trong biểu thức

Phép nối chuỗi có thể nhận giá trị nguyên thủy hoặc giá trị tham chiếu:

```java
String message = "count=" + 42;       // "count=42"
String flag = "active=" + true;       // "active=true"
Object value = null;
String text = "value=" + value;       // "value=null"
```

Java thực hiện chuyển đổi sang String cho toán hạng phù hợp; mã ứng dụng không cần gọi `toString()` thủ công cho mọi phần.

Nhưng điều này cũng có thể che lỗi: nếu `null` là trạng thái nghiệp vụ không hợp lệ, hãy kiểm tra trạng thái thay vì để phép nối chuỗi biến nó thành văn bản `"null"` rồi tiếp tục xử lý.

Khi biểu thức trộn số và String, thứ tự đánh giá toán hạng ảnh hưởng kết quả:

Java đánh giá toán hạng từ trái sang phải. Đây là lý do phép cộng số có thể xảy ra trước khi biểu thức chuyển sang ngữ cảnh nối String.

Tránh nhét tác dụng phụ phức tạp vào cùng một biểu thức; tách bước giúp suy luận và gỡ lỗi rõ hơn.

```java
System.out.println(1 + 2 + "x"); // "3x"
System.out.println("x" + 1 + 2); // "x12"
```
