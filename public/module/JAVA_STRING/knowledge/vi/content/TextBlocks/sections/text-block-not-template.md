Text Block không tự nội suy biến:

```java
"""
Hello ${name}
"""
```

không tự thay `${name}` thành giá trị.

Muốn chèn dữ liệu vẫn cần định dạng, nối chuỗi hoặc API/cơ chế mẫu (template) phù hợp.

```java
String template = """
        Hello %s
        """;

String message = template.formatted(name);
```

Text Block chỉ làm cách biểu diễn trong mã nguồn dễ đọc hơn; nó không biến `%s`, `${name}` hay ký hiệu tùy ý thành nội suy nếu không có API khác xử lý.
