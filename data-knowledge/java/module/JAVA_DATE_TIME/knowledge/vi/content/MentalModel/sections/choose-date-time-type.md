Câu hỏi đúng không phải là “lớp nào có nhiều phương thức nhất?”, mà là **“dữ liệu này thật sự biết điều gì?”**.

| Bài toán | Kiểu khởi đầu phù hợp | Vì sao |
| --- | --- | --- |
| ngày sinh | `LocalDate` | chỉ là ngày lịch |
| giờ mở cửa hằng ngày | `LocalTime` | chỉ là giờ trong ngày |
| lịch học 09:00 ngày 05/10 trước khi chọn địa điểm | `LocalDateTime` | có ngày + giờ nhưng chưa có múi giờ |
| thời điểm yêu cầu đến máy chủ | `Instant` | cần điểm toàn cầu không mơ hồ |
| lịch họp 09:00 tại Paris | `ZonedDateTime` | cần cả các trường cục bộ và quy tắc múi giờ |
| dấu thời gian từ giao thức có `+07:00` nhưng không có vùng | `OffsetDateTime` | dữ liệu biết độ lệch cụ thể nhưng không biết ZoneId |
| kỳ thanh toán `2026-10` | `YearMonth` | biết năm + tháng nhưng cố ý không tự tạo ngày |
| sinh nhật lặp lại `--07-20` | `MonthDay` | biết tháng + ngày nhưng không gắn năm cụ thể |
| chỉ một năm như `2026` | `Year` | nghiệp vụ chỉ sở hữu năm |
| `09:30+07:00` từ giao thức | `OffsetTime` | giờ trong ngày + độ lệch nhưng không có ngày/vùng |

### Quy tắc chọn nhanh

```text
Chỉ ngày?                      → LocalDate
Chỉ giờ trong ngày?            → LocalTime
Ngày + giờ, chưa có múi giờ?       → LocalDateTime
Cần mốc tuyệt đối trên dòng thời gian?→ Instant
Cần ngày/giờ + quy tắc vùng?    → ZonedDateTime
Cần ngày/giờ + độ lệch cố định?    → OffsetDateTime
Cần năm-tháng nhưng không có ngày? → YearMonth
Cần tháng-ngày nhưng không có năm? → MonthDay
```

Các kiểu như `Year`, `YearMonth`, `MonthDay` và `OffsetTime` không có chương riêng trong lộ trình học này vì cơ chế của chúng được suy ra từ các khái niệm chính. Nhưng chúng rất quan trọng khi mô hình hóa: **nếu nghiệp vụ chỉ biết năm-tháng, đừng tự tạo ngày `01`; nếu nghiệp vụ chỉ biết tháng-ngày, đừng tự tạo một năm giả**.

### “Local” không có nghĩa là “múi giờ máy hiện tại”

Tên `LocalDateTime` dễ gây hiểu nhầm. `Local` ở đây nghĩa là **các trường ngày/giờ địa phương chưa gắn múi giờ/độ lệch**, không phải tự động lấy múi giờ mặc định hệ thống.

```java
LocalDateTime local = LocalDateTime.of(2026, 10, 5, 9, 0);
```

Đối tượng này không chứa:

```text
Asia/Ho_Chi_Minh
+07:00
UTC
```

Muốn biến nó thành một mốc trên dòng thời gian, ứng dụng phải cung cấp múi giờ/độ lệch một cách có chủ đích.

### Lộ trình học của mô-đun

Từ đây, các chương đi theo đúng câu hỏi nghiệp vụ:

```text
Ngày?                → LocalDate
Giờ?                 → LocalTime
Ngày + giờ cục bộ?    → LocalDateTime
Mốc trên dòng thời gian?  → Instant
Độ lệch UTC hay múi giờ?  → ZoneOffset / ZoneId
Gắn múi giờ vào giá trị?   → ZonedDateTime / OffsetDateTime
Khoảng thời gian?     → Duration / Period
Văn bản ↔ ngày-giờ?       → Định dạng / Phân tích chuỗi
Cộng/trừ/so sánh + DST?   → Phép toán / So sánh
"Bây giờ" kiểm thử được? → Clock
API cũ + múi giờ mặc định + lưu trữ? → Tương tác API cũ / Tổng hợp
```

Nếu chỉ nhớ một điều trước khi sang chương tiếp theo, hãy nhớ: **chọn kiểu ngày-giờ theo ý nghĩa dữ liệu, không theo thói quen lưu mọi thứ thành dấu thời gian**.
