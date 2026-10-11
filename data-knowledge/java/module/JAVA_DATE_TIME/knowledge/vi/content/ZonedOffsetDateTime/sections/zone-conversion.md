### Giữ nguyên Instant

```java
ZonedDateTime source = ZonedDateTime.of(
        2026, 10, 5, 9, 0, 0, 0,
        ZoneId.of("Asia/Ho_Chi_Minh")
);

ZonedDateTime parisView = source.withZoneSameInstant(
        ZoneId.of("Europe/Paris")
);
```

Dùng khi đang hiển thị **cùng một sự kiện** cho người dùng ở múi giờ khác.

### Giữ nguyên các trường ngày-giờ cục bộ

```java
ZonedDateTime reinterpreted = source.withZoneSameLocal(
        ZoneId.of("Europe/Paris")
);
```

Thao tác này giữ ngày/giờ cục bộ càng nguyên vẹn càng tốt rồi phân giải theo múi giờ mới; vì vậy `Instant` thường thay đổi. Đây không phải “đổi cách hiển thị” cùng một sự kiện, mà là **diễn giải lại** lịch cục bộ trong vùng khác.

### Chuyển từ Instant sang cách hiển thị cục bộ

```java
Instant eventTime = Instant.parse("2026-10-05T02:00:00Z");

ZonedDateTime vietnamView = eventTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
ZonedDateTime parisView = eventTime.atZone(ZoneId.of("Europe/Paris"));
```

Cả hai cách hiển thị giữ cùng một sự kiện trên dòng thời gian.

### OffsetDateTime cũng có hai cách chuyển đổi tương ứng

Cùng mô hình tư duy áp dụng cho `OffsetDateTime`:

```java
OffsetDateTime original = OffsetDateTime.parse("2026-10-05T09:00:00+07:00");

OffsetDateTime sameInstant = original.withOffsetSameInstant(
        ZoneOffset.ofHours(2)
);
// 2026-10-05T04:00+02:00 → cùng Instant

OffsetDateTime sameLocal = original.withOffsetSameLocal(
        ZoneOffset.ofHours(2)
);
// 2026-10-05T09:00+02:00 → cùng trường cục bộ, Instant thay đổi
```

```text
withOffsetSameInstant
→ giữ mốc trên dòng thời gian, đổi đồng hồ cục bộ để phù hợp độ lệch mới

withOffsetSameLocal
→ giữ các trường cục bộ, diễn giải lại chúng dưới độ lệch mới
```

Vì `OffsetDateTime` không có quy tắc của vùng, đây chỉ là đổi giữa các độ lệch cụ thể; không có bước tra quy tắc DST như khi đổi `ZoneId` theo vùng.

Khi làm việc với khoảng trống/chồng lặp DST, việc phân giải các trường cục bộ có thêm quy tắc đặc biệt; chương **Phép toán / So sánh** sẽ giải thích chi tiết. Trước đó, ta cần phân biệt hai kiểu “khoảng thời gian”: `Duration` và `Period`.
