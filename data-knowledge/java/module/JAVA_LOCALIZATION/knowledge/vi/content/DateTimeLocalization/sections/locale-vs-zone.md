Đây là ranh giới quan trọng nhất của chương:

```text
Instant
→ một điểm trên dòng thời gian

ZoneId
→ biến Instant thành ngày/giờ địa phương theo quy tắc múi giờ

Locale
→ quyết định cách trình bày ngày/giờ địa phương cho người đọc
```

Ví dụ cùng một thời điểm tuyệt đối:

```java
Instant instant = Instant.parse("2026-09-27T08:30:00Z");

ZoneId hcm = ZoneId.of("Asia/Ho_Chi_Minh");
ZoneId newYork = ZoneId.of("America/New_York");

ZonedDateTime vietnamTime = instant.atZone(hcm);
ZonedDateTime newYorkTime = instant.atZone(newYork);
```

Sau đó mới chọn Locale để định dạng:

```java
DateTimeFormatter viFormatter = DateTimeFormatter
        .ofLocalizedDateTime(FormatStyle.MEDIUM)
        .withLocale(Locale.forLanguageTag("vi-VN"));

String display = viFormatter.format(vietnamTime);
```

Ta hoàn toàn có thể định dạng `newYorkTime` bằng `vi-VN`; điều đó có nghĩa “giờ New York nhưng trình bày theo quy ước tiếng Việt”. Không có mâu thuẫn nào.
