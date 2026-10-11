`DateTimeFormatter` cung cấp các kiểu định dạng đã bản địa hóa:

```java
DateTimeFormatter formatter = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.MEDIUM)
        .withLocale(Locale.forLanguageTag("vi-VN"));

String text = formatter.format(LocalDate.of(2026, 9, 27));
```

Các `FormatStyle` gồm:

```text
FULL
LONG
MEDIUM
SHORT
```

Ta cũng có:

```java
DateTimeFormatter.ofLocalizedTime(style);
DateTimeFormatter.ofLocalizedDateTime(dateStyle, timeStyle);
```

Ưu điểm của kiểu định dạng theo Locale là ứng dụng chỉ nói **mức chi tiết mong muốn**, còn dữ liệu Locale quyết định mẫu cụ thể. Điều này tốt hơn việc ghi cứng mẫu cho mọi Locale.

```text
ứng dụng
→ ngày ở mức MEDIUM

Locale vi-VN
→ mẫu phù hợp tiếng Việt

Locale en-US
→ mẫu phù hợp tiếng Anh Mỹ
```

Kết quả chính xác có thể thay đổi theo dữ liệu Locale của môi trường chạy; không nên viết kiểm thử phụ thuộc quá chặt vào chuỗi cụ thể nếu hợp đồng chỉ yêu cầu kiểu định dạng theo Locale chứ không yêu cầu một mẫu cố định.
