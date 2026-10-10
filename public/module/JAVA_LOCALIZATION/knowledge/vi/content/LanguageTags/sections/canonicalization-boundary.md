Thẻ ngôn ngữ nên được phân tích bằng API chuẩn thay vì tự `split("-")`, vì BCP 47 còn có biến thể (`variant`), phần mở rộng (`extension`) và các subtag dùng riêng (`private-use`).

`Locale.forLanguageTag(...)` được thiết kế để chuyển một thẻ ngôn ngữ sang `Locale`, nhưng nó khá khoan dung với dữ liệu đầu vào. Nếu ứng dụng cần **từ chối dữ liệu không hợp lệ một cách chặt chẽ**, dùng `Locale.Builder` sẽ tạo ranh giới kiểm tra dữ liệu rõ hơn:

```java
Locale locale = new Locale.Builder()
        .setLanguageTag(input)
        .build();
```

Dữ liệu đầu vào sai cấu trúc có thể gây `IllformedLocaleException`.

Điều này dẫn tới hai chính sách khác nhau:

```text
đầu vào từ nguồn tin cậy / muốn cố gắng xử lý tối đa
→ Locale.forLanguageTag(...)

đầu vào công khai và hợp đồng yêu cầu kiểm tra chặt
→ Locale.Builder.setLanguageTag(...)
→ bắt/chuyển IllformedLocaleException thành lỗi kiểm tra dữ liệu phù hợp
```

### Dạng chuẩn không thay thế kiểm tra nghiệp vụ

Một thẻ ngôn ngữ phân tích được về mặt cú pháp không có nghĩa ứng dụng phải hỗ trợ nó.

Ví dụ ứng dụng chỉ có gói tài nguyên cho `vi-VN` và `en-US` thì `fr-FR` vẫn là thẻ ngôn ngữ hợp lệ, nhưng ứng dụng có thể cần cơ chế dự phòng hoặc từ chối theo chính sách của sản phẩm.

Vì vậy cần tách:

```text
độ hợp lệ cú pháp
→ thẻ ngôn ngữ có đúng cấu trúc không?

hỗ trợ của ứng dụng
→ hệ thống có tài nguyên/quy tắc cho Locale đó không?
```

Chương tiếp theo dùng `Locale` đã xác định để giải quyết bài toán quan trọng nhất của bản địa hóa: **lấy đúng thông điệp/tài nguyên mà không ghi cứng if/else theo từng ngôn ngữ**.
