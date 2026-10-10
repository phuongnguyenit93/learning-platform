`LocalDate` luôn đại diện cho một ngày hợp lệ của mô hình lịch mà nó sử dụng. Java không âm thầm giữ một giá trị như “31/02”.

```java
LocalDate.of(2026, 2, 30); // DateTimeException
```

### Năm nhuận

```java
LocalDate leapDay = LocalDate.of(2024, 2, 29);
boolean leap = leapDay.isLeapYear();
```

`2025-02-29` không hợp lệ; gọi `LocalDate.of(2025, 2, 29)` sẽ ném `DateTimeException`.

### Cộng tháng ở ngày cuối tháng

Một trường hợp dễ gây bất ngờ:

```java
LocalDate january31 = LocalDate.of(2026, 1, 31);
LocalDate result = january31.plusMonths(1);
```

Tháng 2/2026 không có ngày 31. `plusMonths` điều chỉnh về ngày hợp lệ cuối cùng của tháng đích, nên kết quả là `2026-02-28`.

Mô hình tư duy:

```text
2026-01-31
    + 1 tháng theo lịch
        ↓
tháng đích = 2026-02
        ↓
31 không hợp lệ
        ↓
chọn ngày hợp lệ cuối cùng = 28
```

Điều này khác hoàn toàn với việc cộng một số giây cố định.

### Khi nào LocalDate là lựa chọn đúng?

Dùng `LocalDate` khi câu trả lời cho câu hỏi sau là “không”:

```text
Giá trị này có cần biết giờ trong ngày không?
Giá trị này có cần xác định một `Instant` toàn cục không?
```

Ví dụ: sinh nhật, ngày phát hành hóa đơn, ngày hết hạn theo lịch, ngày nghỉ lễ. Nếu chương trình bắt đầu cần “mấy giờ” hoặc “ở múi giờ nào”, đó là dấu hiệu chuyển sang kiểu khác thay vì nhồi thêm quy ước vào `LocalDate`.
