`OffsetDateTime` giữ các trường cục bộ cùng **một `ZoneOffset` cụ thể**, nhưng không giữ danh tính vùng có tên và bộ quy tắc của vùng.

```java
OffsetDateTime value = OffsetDateTime.of(
        2026, 10, 5,
        9, 0, 0, 0,
        ZoneOffset.ofHours(7)
);
```

Nó vẫn xác định được một `Instant` vì ngày-giờ cục bộ + độ lệch là đủ:

```java
Instant instant = value.toInstant();
```

Nhưng từ giá trị đó không thể kết luận vùng là `Asia/Ho_Chi_Minh`.

### Chọn ZonedDateTime hay OffsetDateTime?

```text
Nghiệp vụ cần vùng có tên và quy tắc theo thời gian?
→ ZonedDateTime

Ranh giới chỉ cung cấp ngày-giờ cục bộ + độ lệch cụ thể?
→ OffsetDateTime

Chỉ cần mốc toàn cục để lưu/so sánh?
→ cân nhắc Instant
```

Giao thức/API thường truyền dấu thời gian có độ lệch rất tốt, nhưng ứng dụng lập lịch có thể vẫn cần `ZoneId` riêng nếu quy tắc tương lai là thông tin quan trọng.
