Một thẻ ngôn ngữ ghép nhiều subtag, thường theo hướng từ tổng quát đến cụ thể:

```text
language[-Script][-REGION][-variant...][-extensions...]
```

Ví dụ:

```text
vi-VN
en-US
en-GB
zh-Hans-CN
zh-Hant-TW
```

Nói ngắn gọn, **language tag là chuỗi văn bản chuẩn mô tả Locale**, còn `Locale` là đối tượng Java biểu diễn thông tin đó trong chương trình.

```text
"vi-VN"
→ thẻ ngôn ngữ dùng để trao đổi

Locale.forLanguageTag("vi-VN")
→ đối tượng Java dùng khi gọi API
```

Ta cần thẻ ngôn ngữ vì đối tượng Java không thể được đặt trực tiếp vào HTTP header, URL hay tệp cấu hình. Một chuẩn văn bản chung giúp trình duyệt, máy chủ và các dịch vụ khác nhau cùng hiểu một ngữ cảnh Locale.

Ý nghĩa không phải là “một String tùy ý có dấu gạch ngang”. Mỗi phần có vai trò chuẩn để các hệ thống hiểu tương thích với nhau.

Thẻ ngôn ngữ hữu ích vì ranh giới trao đổi giữa các hệ thống thường là văn bản:

```text
trình duyệt / HTTP / cấu hình / cơ sở dữ liệu
        ↓ thẻ ngôn ngữ
ứng dụng Java
        ↓ Locale
bộ định dạng / ResourceBundle / Collator
```
