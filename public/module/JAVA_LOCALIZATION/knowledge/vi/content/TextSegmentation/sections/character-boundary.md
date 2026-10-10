Ở mô-đun `String`, người học đã biết:

```text
char
≠ Unicode code point
≠ luôn luôn là "một ký tự người dùng nhìn thấy"
```

Bản địa hóa bổ sung bước tiếp theo: khi cần di chuyển/cắt văn bản theo **ký tự mà người dùng cảm nhận**, không nên mặc định mỗi UTF-16 `char` là một ký tự hoàn chỉnh.

```java
BreakIterator iterator = BreakIterator.getCharacterInstance(locale);
iterator.setText(text);

for (int end = iterator.first(), start = end;
     (end = iterator.next()) != BreakIterator.DONE;
     start = end) {
    String unit = text.substring(start, end);
}
```

`getCharacterInstance(...)` giúp tìm ranh giới tương ứng với các cụm ký tự mà người dùng cảm nhận như một đơn vị, thay vì cắt văn bản mù theo chỉ số UTF-16.

Ranh giới này có quan hệ chặt với **grapheme cluster** trong Unicode. Phần lý thuyết code point/grapheme/chuẩn hóa thuộc mô-đun `String`; chương này chỉ sở hữu việc **dùng phân tích ranh giới trong bản địa hóa**.

Trường hợp sử dụng điển hình:

```text
di chuyển con trỏ
chọn văn bản
cắt ngắn an toàn
di chuyển theo ký tự trong UI
```
