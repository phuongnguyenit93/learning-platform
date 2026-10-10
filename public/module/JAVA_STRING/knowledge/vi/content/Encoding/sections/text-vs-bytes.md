Một String như:

```text
"Xin chào"
```

không tự mang một “dãy byte duy nhất”. Cùng văn bản có thể được mã hóa thành byte khác nhau tùy Charset.

mô hình tư duy:

```text
String / văn bản
        ↓ mã hóa bằng Charset
byte[]
        ↓ giải mã bằng cùng Charset
String / văn bản
```

Nếu mã hóa và giải mã dùng Charset khác nhau, kết quả có thể bị sai dù byte truyền qua không hề bị mất.

### VÌ SAO — String không “có sẵn cách mã hóa byte”

`String` là giá trị văn bản trong Java. Mã hóa chỉ xuất hiện khi văn bản đi qua ranh giới cần byte:

```text
Java String
→ tệp
→ socket / nội dung HTTP
→ giao thức cơ sở dữ liệu
→ dữ liệu của hệ thống môi giới thông điệp (message broker)
```

Cùng một văn bản có thể có biểu diễn byte khác nhau:

```text
"é"

UTF-8
→ C3 A9

ISO-8859-1
→ E9
```

Vì vậy câu hỏi “String này được mã hóa theo kiểu nào?” thường sai tầng. Câu hỏi đúng là: **ranh giới này dùng Charset nào để chuyển String ↔ byte?** `String` biểu diễn văn bản; Charset mới quyết định cách văn bản được ánh xạ sang byte.
