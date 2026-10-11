```java
String json = """
    {
      "name": "Java"
    }
    """;
```

Kết quả vẫn là `java.lang.String` bình thường.

Text Block đặc biệt hữu ích cho JSON, SQL, HTML hoặc văn bản mẫu nhiều dòng vì giảm nhiễu do ký tự thoát và phép nối chuỗi.

### Text Block là cú pháp mã nguồn, không phải kiểu dữ liệu mới khi chạy

Hai cách viết có thể tạo cùng một giá trị String:

```java
String a = "hello\nworld\n";

String b = """
        hello
        world
        """;

a.equals(b); // true
```

Mọi quy tắc về tính bất biến, so sánh bằng nhau, mã hóa và Unicode của String vẫn áp dụng y hệt.

### Dấu mở đầu

Sau dấu mở `"""`, Text Block cần ký tự kết thúc dòng theo cú pháp Java. Nội dung thực sự bắt đầu ở các dòng sau, giúp mã nguồn nhiều dòng có cấu trúc rõ ràng.
