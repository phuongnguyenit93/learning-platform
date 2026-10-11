Không có `Clock`:

```java
boolean isExpired(Instant expiresAt) {
    return !Instant.now().isBefore(expiresAt);
}
```

Phương thức này phụ thuộc trực tiếp vào đồng hồ hệ thống. Kiểm thử chạy lúc nào thì `now()` là lúc đó.

Với `Clock`:

```java
boolean isExpired(Instant expiresAt, Clock clock) {
    return !Instant.now(clock).isBefore(expiresAt);
}
```

Quy tắc nghiệp vụ không đổi, nhưng nguồn thời gian hiện tại đã trở thành phụ thuộc rõ ràng.

Trong ví dụ này, quy ước là token **hết hạn ngay khi `now >= expiresAt`**. Nếu nghiệp vụ muốn chỉ hết hạn sau mốc đó, có thể dùng `isAfter`; điều quan trọng là chọn và kiểm thử trường hợp bằng đúng hạn chót một cách nhất quán.

### Một số phương thức tạo Clock

```java
Clock utc = Clock.systemUTC();
Clock systemZone = Clock.systemDefaultZone();
Clock fixed = Clock.fixed(
        Instant.parse("2026-09-27T10:00:00Z"),
        ZoneOffset.UTC
);
Clock shifted = Clock.offset(utc, Duration.ofMinutes(5));
```

`Clock` cung cấp cả `Instant` và ngữ cảnh múi giờ cho những API `now(clock)` cần chúng.

```java
Instant now = clock.instant();
ZoneId zone = clock.getZone();
```

### InstantSource — khi chỉ cần nguồn Instant

Từ Java 17 trở đi, `java.time` còn có `InstantSource`: một **giao diện hẹp hơn `Clock`**, chỉ đại diện cho nguồn cung cấp `Instant` hiện tại.

```text
InstantSource
→ cần biết "Instant hiện tại là gì?"

Clock
→ cũng cung cấp Instant hiện tại
→ đồng thời mang ZoneId cho các API cần ngữ cảnh lịch/múi giờ
```

`Clock` triển khai `InstantSource`, nên một dịch vụ chỉ cần dấu thời gian trên dòng thời gian có thể phụ thuộc vào giao diện hẹp hơn:

```java
boolean isExpired(Instant expiresAt, InstantSource source) {
    return !source.instant().isBefore(expiresAt);
}
```

Kiểm thử vẫn có thể dùng nguồn cố định:

```java
InstantSource fixed = InstantSource.fixed(
        Instant.parse("2026-09-27T10:00:00Z")
);
```

Không cần thay mọi `Clock` bằng `InstantSource`: nếu logic cần `ZoneId`, `LocalDate.now(clock)` hoặc `ZonedDateTime.now(clock)`, `Clock` vẫn là lựa chọn phù hợp hơn.

### Clock không phải đồng hồ bấm giờ để đo thời lượng

`Clock`/`Instant.now()` trả lời câu hỏi **“hiện tại là mốc nào trên dòng thời gian?”**. Đồng hồ hệ thống có thể bị điều chỉnh bởi hệ điều hành, đồng bộ thời gian hoặc thay đổi nguồn thời gian.

Nếu mục tiêu là đo **một đoạn mã chạy mất bao lâu** trong cùng JVM, Java có `System.nanoTime()`:

```java
long start = System.nanoTime();

doWork();

long elapsedNanos = System.nanoTime() - start;
```

Giá trị tuyệt đối từ `nanoTime()` không phải dấu thời gian, không chuyển đổi sang `Instant`, và không có ý nghĩa lịch. Chỉ **hiệu giữa hai lần đọc trong cùng JVM** mới có ý nghĩa thời lượng đã trôi qua.

Mô hình tư duy:

```text
Clock / Instant.now()
→ "bây giờ là thời điểm nào?"

System.nanoTime()
→ "đã trôi qua bao lâu giữa hai điểm đo trong JVM?"
```

Hai bài toán khác nhau, dù cả hai đều liên quan đến thời gian.
