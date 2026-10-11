Hai String có thể **tương đương chuẩn tắc (canonically equivalent)** về Unicode nhưng vẫn:

```java
System.out.println(a.equals(b)); // false
```

nếu chuỗi điểm mã khác nhau.

Sau khi chuẩn hóa cả hai về cùng dạng, phép so sánh bằng nhau có thể cho kết quả phù hợp với trường hợp sử dụng mong muốn.

Điều này cho thấy `String.equals` so chuỗi nội dung của String, không tự thực hiện chuẩn hóa Unicode hoặc tương đương theo ngôn ngữ.

Ví dụ cụ thể:

```java
String composed = "é";
String decomposed = "e\u0301";

composed.equals(decomposed); // false

String a = Normalizer.normalize(composed, Normalizer.Form.NFC);
String b = Normalizer.normalize(decomposed, Normalizer.Form.NFC);

a.equals(b); // true
```

Tương đương chuẩn tắc là khái niệm Unicode; so sánh/tìm kiếm theo ngôn ngữ còn có thể cần tầng `Locale`/`Collator` cao hơn.

Chương tiếp theo dùng chính mô hình Unicode này để trả lời một câu hỏi ở ranh giới hệ thống: **văn bản trong Java được chuyển thành byte và khôi phục từ byte bằng Charset như thế nào?**
