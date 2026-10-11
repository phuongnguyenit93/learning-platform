Khi khung làm việc (framework) hoặc tầng báo cáo cần biết mẫu tương ứng với kiểu định dạng theo Locale, `DateTimeFormatterBuilder.getLocalizedDateTimePattern(...)` cho phép truy vấn mẫu:

```java
String pattern = DateTimeFormatterBuilder.getLocalizedDateTimePattern(
        FormatStyle.MEDIUM,
        null,
        IsoChronology.INSTANCE,
        locale
);
```

Điều này hữu ích cho công cụ hoặc tích hợp cần mẫu cụ thể. Tuy nhiên mã nghiệp vụ thường nên dùng `ofLocalizedDate/Time/DateTime` trực tiếp thay vì lấy mẫu rồi ghi cứng/sao chép lại.

Nếu ứng dụng thật sự yêu cầu mẫu cố định theo hợp đồng, dùng `DateTimeFormatter.ofPattern(pattern, locale)`. Khi đó **ứng dụng sở hữu mẫu**, không còn hoàn toàn dựa vào kiểu định dạng theo Locale của JDK.
