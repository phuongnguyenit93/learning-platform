`ZoneId` theo vùng dẫn tới `ZoneRules`:

```java
ZoneId paris = ZoneId.of("Europe/Paris");
ZoneRules rules = paris.getRules();
```

Tập quy tắc dùng cơ sở dữ liệu múi giờ của JDK để trả lời các câu hỏi như:

```text
Instant này đang dùng độ lệch nào?
LocalDateTime này có độ lệch hợp lệ nào?
Có lần chuyển đổi DST ở đây không?
```

Ví dụ lấy độ lệch tại hai `Instant`:

```java
ZoneRules rules = ZoneId.of("Europe/Paris").getRules();

ZoneOffset winter = rules.getOffset(Instant.parse("2026-01-15T12:00:00Z"));
ZoneOffset summer = rules.getOffset(Instant.parse("2026-07-15T12:00:00Z"));
```

Hai độ lệch có thể khác nhau vì quy tắc của vùng.

### Vì sao `+07:00` không đồng nghĩa `Asia/Ho_Chi_Minh`?

Ngay cả khi hôm nay một vùng có độ lệch `+07:00`, quan hệ đúng là:

```text
ZoneId
    ↓ dùng quy tắc + Instant/ngày-giờ cục bộ
ZoneOffset
```

không phải:

```text
ZoneOffset
    ↓ suy ngược chắc chắn
ZoneId
```

Nhiều vùng có thể cùng độ lệch tại một thời điểm. Một độ lệch không chứa đủ thông tin để khôi phục vùng.

### Quy tắc múi giờ là dữ liệu có thể được cập nhật

Chính phủ có thể thay đổi luật giờ mùa hè hoặc độ lệch UTC. JDK cập nhật cơ sở dữ liệu múi giờ theo các bản phát hành/cập nhật. Vì thế một lịch tương lai gắn với vùng nên giữ `ZoneId` khi nghiệp vụ cần quy tắc của vùng, thay vì đóng băng một độ lệch được tính quá sớm.

Chương tiếp theo đặt các mảnh lại với nhau bằng `ZonedDateTime` và `OffsetDateTime`.
