Trước khi đi sâu vào nhóm và lượng từ, cần phân biệt rõ ba tầng: khi nào Regex thực sự cần thiết, cú pháp Regex được biểu diễn thế nào trong String literal của Java, và các cờ biên dịch thay đổi quy tắc so khớp ra sao.

### Ký tự thoát của Java và Regex là hai tầng khác nhau

Muốn Regex khi chạy là `\d+`:

```java
Pattern.compile("\\d+");
```

```text
mã nguồn Java "\\d+"
        ↓ Java phân tích String literal
String khi chạy "\d+"
        ↓ Regex phân tích mẫu
mẫu chữ số
```

Đây là nguyên nhân rất nhiều Regex trong Java trông có “gấp đôi dấu gạch chéo ngược”.

Nếu văn bản đến từ người dùng/cấu hình và phải được so khớp như literal, `Pattern.quote(text)` giúp tránh diễn giải ký tự đặc biệt ngoài ý muốn.

### Các thành phần cơ bản

```text
[abc]     lớp ký tự
[^abc]    lớp ký tự phủ định
^ / $     mốc biên
a|b       lựa chọn
(...)     nhóm
\d \w   lớp dựng sẵn
```

Không cần Regex khi API String cho tìm kiếm literal đã đủ rõ; đây là ranh giới lựa chọn đã thiết lập ở đầu chương.

### Cờ của Pattern thay đổi ngữ nghĩa so khớp

Cùng một Regex có thể mang ngữ nghĩa khác khi biên dịch với các cờ khác nhau:

```java
Pattern multiline = Pattern.compile(
        "^error:",
        Pattern.MULTILINE
);

Pattern dotAll = Pattern.compile(
        "BEGIN.*END",
        Pattern.DOTALL
);
```

Một số cờ quan trọng:

```text
CASE_INSENSITIVE
→ so khớp không phân biệt hoa/thường

MULTILINE
→ ^ và $ có thể hoạt động theo từng dòng

DOTALL
→ . cũng khớp ký tự kết thúc dòng

UNICODE_CASE
→ áp dụng quy tắc chữ hoa/thường theo Unicode khi kết hợp với so khớp không phân biệt hoa/thường

UNICODE_CHARACTER_CLASS
→ các lớp ký tự dựng sẵn/POSIX dùng ngữ nghĩa Unicode rộng hơn
```

Không nên bật cờ “cho chắc”. Cờ là một phần của hợp đồng Regex và có thể thay đổi cả tính đúng đắn lẫn hiệu năng.

Đặc biệt, ngữ nghĩa Unicode của Regex không nên bị nhầm với quy tắc ngôn ngữ phụ thuộc vùng miền: cờ Regex và `Locale/Collator` giải quyết các tầng trừu tượng khác nhau.
