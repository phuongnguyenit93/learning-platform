`Instant` đại diện cho **một điểm trên dòng thời gian UTC**. Nó không chứa cách hiển thị theo lịch địa phương như `2026-10-05 09:00 Asia/Ho_Chi_Minh`; nó tập trung vào vị trí tuyệt đối của sự kiện.

```java
Instant now = Instant.now();
Instant explicit = Instant.parse("2026-10-05T02:00:00Z");
```

Ký tự `Z` trong ISO-8601 nghĩa là độ lệch `+00:00`, tức UTC.

### Vì sao Instant quan trọng trong hệ thống phân tán?

Giả sử hai máy chủ ở hai vùng khác nhau ghi nhận cùng một sự kiện:

```text
Máy chủ A hiển thị: 09:00 tại Việt Nam
Máy chủ B hiển thị: 04:00 tại Paris
```

Hai đồng hồ cục bộ có thể khác nhau nhưng vẫn trỏ tới **cùng một `Instant`**. Khi cần sắp xếp, kiểm toán (audit), thời điểm sự kiện hoặc giao tiếp giữa hệ thống, việc đưa dữ liệu về một dòng thời gian chung giúp loại bỏ tính mơ hồ của giờ cục bộ.

### Instant không phải “UTC LocalDateTime”

Đừng hình dung `Instant` như một `LocalDateTime` đặc biệt đang ở múi giờ UTC. `Instant` không sở hữu các trường năm/tháng/ngày/giờ như dữ liệu nghiệp vụ chính. Nó là một mốc trên dòng thời gian; các trường theo lịch chỉ xuất hiện khi ta chiếu `Instant` đó qua một múi giờ.

```java
Instant instant = Instant.parse("2026-10-05T02:00:00Z");

ZonedDateTime vietnamView = instant.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
ZonedDateTime parisView = instant.atZone(ZoneId.of("Europe/Paris"));
```

Cùng một `Instant`, nhiều cách hiển thị cục bộ có thể khác nhau.

### Phần nâng cao — Java Time-Scale và giây nhuận

Người mới có thể giữ mô hình tư duy đơn giản: `Instant` là một điểm trên dòng thời gian toàn cục dựa trên UTC. Ở mức đặc tả sâu hơn, Java định nghĩa **Java Time-Scale** cho các lớp ngày-giờ; nó chia mỗi ngày theo lịch thành 86.400 phần theo mô hình của Java và có quy tắc riêng quanh **giây nhuận** — giây điều chỉnh đặc biệt đôi khi được thêm vào thang thời gian dân sự để giữ nó gần với chuyển động quay của Trái Đất.

Điểm cần nhớ cho ứng dụng thông thường:

```text
Instant
→ phù hợp cho dấu thời gian sự kiện / sắp xếp / ranh giới lưu trữ

Instant
→ không nên được suy diễn thành công cụ đo thời gian thiên văn/giây nhuận chính xác
  nếu nghiệp vụ không có yêu cầu chuyên biệt đó
```
