Không có một quy tắc “mọi dữ liệu ngày-giờ đều phải lưu UTC” áp dụng cho mọi nghiệp vụ. Câu đúng hơn là: **lưu đủ thông tin để phục hồi đúng ý nghĩa mà nghiệp vụ sở hữu**.

### Sự kiện đã xảy ra

Ví dụ:

```text
paymentCapturedAt
requestReceivedAt
auditEventAt
```

Thường cần một mốc trên dòng thời gian → lưu theo `Instant`/UTC là lựa chọn tự nhiên.

### Lịch tương lai gắn với địa điểm

Ví dụ:

```text
"09:00 ngày 05/10 tại Europe/Paris"
```

Nghiệp vụ có thể cần giữ:

```text
ngày-giờ cục bộ
+ ZoneId
```

vì quy tắc của vùng là một phần của ý định lịch. Chỉ giữ `Instant` hoặc độ lệch được tính ở thời điểm ban đầu có thể mất thông tin cần cho việc đổi lịch, hiển thị hoặc thay đổi quy tắc múi giờ trong tương lai.

### Ngày và giờ nghiệp vụ cục bộ

Ngày sinh, ngày hóa đơn hoặc giờ mở cửa không nên bị ép thành `Instant` nếu nghiệp vụ không có ý nghĩa trên dòng thời gian.

### Danh sách kiểm tra trước khi chọn cột và kiểu dữ liệu

```text
1. Đây là giá trị theo lịch hay sự kiện trên dòng thời gian?
2. Có cần giữ một vùng múi giờ có tên không?
3. Độ lệch UTC là dữ liệu gốc hay chỉ là kết quả phân giải?
4. Đây là lịch tương lai hay sự kiện đã xảy ra?
5. Cơ sở dữ liệu giữ độ chính xác tới mức nào?
6. Khi đọc lại, ứng dụng cần phục hồi chính xác thông tin nào?
```

Nếu trả lời được các câu đó, lựa chọn giữa `LocalDate`, `LocalDateTime`, `Instant`, `OffsetDateTime` và `ZonedDateTime` sẽ xuất phát từ nghiệp vụ thay vì một quy ước mơ hồ.

Kết thúc mô-đun, mô hình tư duy nên là:

```text
Hiểu ý nghĩa thời gian trước
        ↓
chọn kiểu thời gian giữ đúng thông tin
        ↓
thêm múi giờ/độ lệch chỉ khi nghiệp vụ cần
        ↓
chọn Duration hay Period theo ý nghĩa
        ↓
định dạng/phân tích chuỗi tại ranh giới dữ liệu
        ↓
truyền Clock vào để kiểm soát "thời điểm hiện tại"
        ↓
tránh múi giờ mặc định ngầm và kiểm soát chuyển đổi API cũ
```
