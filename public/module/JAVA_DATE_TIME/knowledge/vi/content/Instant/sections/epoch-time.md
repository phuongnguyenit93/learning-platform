Một cách biểu diễn mốc trên dòng thời gian là đếm từ một mốc gọi là **epoch**. Với Java `Instant`, mốc chuẩn là `1970-01-01T00:00:00Z`.

```java
Instant epoch = Instant.EPOCH;
Instant fromSeconds = Instant.ofEpochSecond(1_000_000);
Instant fromMillis = Instant.ofEpochMilli(1_000_000);
```

Đọc dữ liệu:

```java
long seconds = instant.getEpochSecond();
int nanos = instant.getNano();
long millis = instant.toEpochMilli();
```

`Instant` về mặt logic được biểu diễn bằng số giây tính từ epoch cộng phần nano giây trong giây. `toEpochMilli()` chỉ đưa giá trị về độ phân giải mili giây và có thể mất phần độ chính xác nhỏ hơn mili giây.

`Instant` có phạm vi rất lớn: từ `Instant.MIN` khoảng năm `-1000000000` tới `Instant.MAX` khoảng năm `+1000000000`. Đây chủ yếu là ranh giới kỹ thuật; nghiệp vụ ứng dụng thông thường nằm rất xa các giới hạn này.

### Giá trị epoch phải ghi rõ đơn vị

Một giá trị số thô như:

```text
1728093600
```

không tự nói đó là:

```text
giây?
mili giây?
micro giây?
nano giây?
```

Sai đơn vị có thể làm dấu thời gian lệch hàng nghìn năm. Ở ranh giới JSON/cơ sở dữ liệu/lược đồ thông điệp, hãy ghi rõ tên và đơn vị, hoặc dùng biểu diễn văn bản ISO-8601 có hợp đồng rõ ràng.

### Epoch không loại bỏ nhu cầu về múi giờ

Thời gian epoch xác định một `Instant` nhưng người dùng vẫn cần múi giờ để xem theo lịch cục bộ:

```java
Instant stored = Instant.parse("2026-10-05T02:00:00Z");
ZoneId userZone = ZoneId.of("Asia/Ho_Chi_Minh");

LocalDateTime displayedLocal = LocalDateTime.ofInstant(stored, userZone);
```

Lưu trữ trên dòng thời gian và hiển thị theo múi giờ là hai trách nhiệm khác nhau.
