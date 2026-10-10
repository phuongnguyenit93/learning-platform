Các phương thức như:

```java
text.toLowerCase()
text.toUpperCase()
```

dùng Locale mặc định. Điều này nguy hiểm nếu String thật ra là định danh/token giao thức.

Một ví dụ kinh điển là chữ `I/i` trong tiếng Thổ Nhĩ Kỳ, nơi quan hệ chữ hoa/chữ thường khác tiếng Anh.

Vì vậy:

```text
văn bản dành cho người dùng
→ chuyển đổi hoa/thường có thể cần Locale của người dùng

định danh / token giao thức / khóa kỹ thuật
→ thường dùng Locale.ROOT hoặc quy tắc tường minh của giao thức
```

Ví dụ:

```java
String normalizedKey = input.toLowerCase(Locale.ROOT);
```

`Locale.ROOT` biểu diễn Locale trung lập về ngôn ngữ/quốc gia cho các thao tác cần hành vi không gắn với Locale của người dùng.

Không nên chuyển toàn bộ văn bản thành chữ thường như một giải pháp thay thế cho mọi phép so sánh không phân biệt hoa/thường. Từng miền nghiệp vụ có hợp đồng riêng; ánh xạ hoa/thường của Unicode có thể phức tạp hơn ASCII.
