Đây là điểm phân biệt quan trọng nhất của chương.

Giá trị:

```text
2026-10-05T09:00
```

có thể ánh xạ tới nhiều `Instant` khác nhau:

```java
LocalDateTime local = LocalDateTime.of(2026, 10, 5, 9, 0);

Instant vietnam = local
        .atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
        .toInstant();

Instant paris = local
        .atZone(ZoneId.of("Europe/Paris"))
        .toInstant();

System.out.println(vietnam);
System.out.println(paris);
```

Cùng các trường cục bộ nhưng vì quy tắc múi giờ khác nhau, hai kết quả trên là hai điểm khác nhau trên dòng thời gian.

Mô hình tư duy:

```text
LocalDateTime
    + ZoneId
        ↓
phân giải các trường cục bộ theo quy tắc múi giờ
        ↓
ZonedDateTime
        ↓
Instant
```

### DST làm sự mơ hồ của LocalDateTime rõ hơn

Ở các vùng có áp dụng giờ mùa hè (DST), một ngày-giờ cục bộ có thể rơi vào:

```text
trường hợp bình thường
→ đúng một độ lệch hợp lệ

khoảng trống (gap)
→ đồng hồ cục bộ nhảy qua một khoảng
→ một số giờ cục bộ không tồn tại

chồng lặp (overlap)
→ đồng hồ quay lại
→ một số giờ cục bộ xảy ra hai lần với hai độ lệch khác nhau
```

Vì `LocalDateTime` không giữ quy tắc múi giờ, bản thân nó không thể giải quyết khoảng trống/chồng lặp. Chương `ZoneOffset / ZoneId` giới thiệu nguyên nhân; chương **Phép toán / So sánh** sẽ đi sâu cách Java phân giải các trường hợp này.

### Sai lầm phổ biến: dùng LocalDateTime cho createdAt

```java
class Order {
    LocalDateTime createdAt;
}
```

Nếu `createdAt` cần biểu diễn một sự kiện đã xảy ra trên hệ thống phân tán, chỉ `LocalDateTime` có thể làm mất ngữ cảnh múi giờ và khiến hai máy chủ ở hai vùng khó so sánh chính xác. `Instant` thường phù hợp hơn cho loại dấu thời gian hướng hệ thống đó.
