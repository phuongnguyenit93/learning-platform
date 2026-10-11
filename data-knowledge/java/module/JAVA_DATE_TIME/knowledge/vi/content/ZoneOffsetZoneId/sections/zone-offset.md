`ZoneOffset` mô tả chênh lệch giữa giờ cục bộ và UTC tại một thời điểm, ví dụ:

```text
Z       → +00:00
+07:00  → nhanh hơn UTC 7 giờ
-05:00  → chậm hơn UTC 5 giờ
```

```java
ZoneOffset utc = ZoneOffset.UTC;
ZoneOffset vietnamLikeOffset = ZoneOffset.of("+07:00");
ZoneOffset minusFive = ZoneOffset.ofHours(-5);
```

Mỗi `ZoneOffset` là **một độ lệch UTC cụ thể**, không phải một bộ quy tắc theo vùng. Giá trị `+07:00` tự nó không mang theo lịch sử địa phương, luật DST hay danh tính khu vực.

Ví dụ dấu thời gian dạng văn bản:

```java
OffsetDateTime value = OffsetDateTime.parse("2026-10-05T09:00:00+07:00");
```

Từ các trường cục bộ + độ lệch, Java xác định được `Instant`:

```java
Instant instant = value.toInstant();
```

Nhưng nếu chỉ có `+07:00`, ta không biết độ lệch đó đến từ `Asia/Ho_Chi_Minh`, một `ZoneId` dùng độ lệch cố định hay nơi nào khác có cùng độ lệch tại thời điểm đó.
