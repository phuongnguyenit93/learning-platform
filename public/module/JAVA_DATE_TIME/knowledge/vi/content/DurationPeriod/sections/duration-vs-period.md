Chọn theo câu hỏi:

```text
“Bao nhiêu thời gian thực đã trôi qua?”
→ Duration

“Bao nhiêu ngày/tháng/năm theo lịch?”
→ Period
```

### DST: 24 giờ có thể khác 1 ngày lịch

Ở múi giờ có lần chuyển DST:

```java
ZonedDateTime start = ZonedDateTime.of(
        LocalDateTime.of(2026, 3, 28, 12, 0),
        ZoneId.of("Europe/Paris")
);

ZonedDateTime plus24Hours = start.plus(Duration.ofHours(24));
ZonedDateTime plusOneDay = start.plus(Period.ofDays(1));
```

`plus24Hours` bảo toàn **thời lượng thực 24 giờ đã trôi qua** trên dòng thời gian. `plusOneDay` bảo toàn ý định **sang ngày lịch tiếp theo theo giờ cục bộ**, nên số giây thực tế đã trôi qua có thể tương đương 23 hoặc 25 giờ quanh lần chuyển DST.

Đây là lý do không nên đổi `Period.ofDays(1)` và `Duration.ofHours(24)` cho nhau chỉ vì ở nhiều ngày bình thường chúng cho kết quả cục bộ giống nhau.

### Độ dài tháng cũng phá vỡ giả định “lịch = số giây cố định”

```text
1 tháng
→ 28, 29, 30 hoặc 31 ngày tùy vị trí trên lịch

1 năm
→ có thể chứa ngày nhuận
```

Không có chuyển đổi tổng quát chính xác từ `Period.ofMonths(1)` thành một `Duration` nếu chưa biết điểm bắt đầu và múi giờ/ngữ cảnh cần thiết.

### Quy tắc chọn nhanh

| Nhu cầu | Chọn |
| --- | --- |
| thời gian chờ HTTP 30 giây | `Duration` |
| TTL của bộ nhớ đệm 10 phút | `Duration` |
| thời gian xử lý giữa hai `Instant` | `Duration` |
| cộng 1 tháng vào ngày hóa đơn | `Period` hoặc `plusMonths` |
| tuổi theo năm/tháng/ngày | `Period` |
| lịch chạy “cùng giờ ngày mai” | phép toán theo lịch, thường `Period`/`plusDays` trên giá trị có múi giờ |

Sau khi có đúng giá trị thời gian và lượng, bước tiếp theo là ranh giới rất phổ biến: **văn bản ↔ đối tượng ngày-giờ**.
