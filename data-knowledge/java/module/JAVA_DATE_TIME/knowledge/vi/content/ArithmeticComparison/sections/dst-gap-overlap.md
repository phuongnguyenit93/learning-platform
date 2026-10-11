Ở vùng áp dụng giờ mùa hè (DST), đồng hồ cục bộ có các lần chuyển đổi đặc biệt.

### Khoảng trống (gap) — một khoảng giờ cục bộ không tồn tại

Khi đồng hồ nhảy về phía trước, ví dụ từ 02:00 lên 03:00, các giờ cục bộ trong khoảng bị bỏ qua không tồn tại trong múi giờ đó.

Khi dùng API tiện ích như `LocalDateTime.atZone(zone)`, Java phân giải khoảng trống bằng cách điều chỉnh giờ cục bộ tiến qua độ dài khoảng trống theo quy tắc của `ZonedDateTime`.

Với đầu vào nghiệp vụ quan trọng, đừng chỉ dựa vào điều chỉnh mặc định nếu “thời gian không tồn tại” phải được báo cho người dùng. Có thể kiểm tra `ZoneRules`:

```java
LocalDateTime local = ...;
ZoneId zone = ZoneId.of("Europe/Paris");

List<ZoneOffset> validOffsets = zone.getRules().getValidOffsets(local);

if (validOffsets.isEmpty()) {
    // giờ cục bộ rơi vào khoảng trống
}
```

### Chồng lặp (overlap) — một giờ cục bộ xảy ra hai lần

Khi đồng hồ quay lại, cùng một giờ cục bộ có thể hợp lệ với hai độ lệch.

```java
List<ZoneOffset> validOffsets = zone.getRules().getValidOffsets(local);

if (validOffsets.size() == 2) {
    // giờ cục bộ bị mơ hồ
}
```

Khi tạo `ZonedDateTime` từ giá trị cục bộ bằng API thông thường, Java có quy tắc cụ thể:

```text
bình thường
→ 1 độ lệch hợp lệ → dùng độ lệch đó

khoảng trống (gap)
→ 0 độ lệch hợp lệ
→ ngày-giờ cục bộ được đẩy tiến theo độ dài khoảng trống

chồng lặp (overlap)
→ 2 độ lệch hợp lệ
→ mặc định dùng độ lệch trước lần chuyển đổi
  (thường là độ lệch mùa hè; API gọi đây là earlier offset)
```

Nếu ứng dụng cần lần xuất hiện còn lại trong vùng chồng lặp, `withLaterOffsetAtOverlap()` cho phép chọn độ lệch sau lần chuyển đổi; `withEarlierOffsetAtOverlap()` chọn độ lệch trước lần chuyển đổi một cách rõ ràng.

Khi cần xem chính lần chuyển đổi thay vì chỉ đếm các độ lệch hợp lệ, `ZoneRules.getTransition(localDateTime)` trả `ZoneOffsetTransition` cho khoảng trống/chồng lặp tương ứng; `nextTransition(instant)` và `previousTransition(instant)` giúp tìm lần chuyển đổi quanh mốc trên dòng thời gian.

Điểm học quan trọng không phải nhớ một ngày DST cụ thể, mà là hiểu:

```text
LocalDateTime + ZoneId
không phải lúc nào cũng ánh xạ 1:1 tới Instant
```
