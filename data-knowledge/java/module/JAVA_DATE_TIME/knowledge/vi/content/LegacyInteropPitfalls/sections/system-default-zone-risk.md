Các lời gọi như:

```java
ZoneId.systemDefault();
LocalDate.now();
ZonedDateTime.now();
```

có thể phụ thuộc cấu hình máy nếu không truyền `Clock`/múi giờ rõ ràng.

Lỗi thường xuất hiện khi:

```text
máy phát triển   → Asia/Ho_Chi_Minh
CI               → UTC
môi trường thực tế → UTC hoặc vùng khác
```

Cùng một `Instant` có thể thuộc các `LocalDate` khác nhau khi được chiếu qua các múi giờ khác nhau, đặc biệt quanh nửa đêm cục bộ.

### Chuyển đổi nguy hiểm

```java
LocalDateTime local = ...;
Instant instant = local.atZone(ZoneId.systemDefault()).toInstant();
```

Nếu `local` thuộc một múi giờ nghiệp vụ cụ thể, dùng giá trị mặc định hệ thống là giả định ẩn. Hãy truyền đúng `ZoneId` từ nghiệp vụ/cấu hình.
