`LocalDateTime` đúng khi nghiệp vụ thật sự sở hữu **các trường lịch cục bộ** nhưng ánh xạ lên dòng thời gian chưa tồn tại hoặc không phải điều cần biểu diễn ở bước đó.

Ví dụ:

### 1. Người dùng nhập lịch trước khi chọn địa điểm

```java
LocalDateTime requestedSlot = LocalDateTime.of(2026, 10, 5, 9, 0);
```

Sau đó người dùng chọn múi giờ:

```java
ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
ZonedDateTime scheduled = requestedSlot.atZone(zone);
```

### 2. Nghiệp vụ cố ý dùng thời gian dân sự cục bộ

**Thời gian dân sự cục bộ (local civil time)** là ngày/giờ theo đồng hồ và lịch mà con người tại một nơi sử dụng cho sinh hoạt/nghiệp vụ, trước khi ta ánh xạ nó thành một `Instant` toàn cục. Một quy tắc nghiệp vụ có thể nói “chốt sổ lúc 23:00 ngày cuối tháng theo lịch nghiệp vụ cục bộ”. Các trường cục bộ là phần của quy tắc; múi giờ có thể được cấu hình ở một ranh giới khác.

### 3. Dữ liệu cơ sở dữ liệu mang nghĩa ngày-giờ cục bộ

Nếu cột cơ sở dữ liệu thật sự có ý nghĩa “dấu thời gian không kèm múi giờ”, `LocalDateTime` thường là ánh xạ tự nhiên hơn `Instant`. Nhưng phải chắc rằng ứng dụng không nhầm cột đó với một `Instant` toàn cục.

### Khi nào không nên dùng?

Không dùng `LocalDateTime` chỉ vì định dạng đầu vào trông như:

```text
2026-10-05 09:00:00
```

**Chuỗi định dạng không quyết định ý nghĩa.** Hãy hỏi dữ liệu muốn nói gì.

```text
Dấu thời gian kiểm toán (audit)? → thường Instant
Cuộc họp ở vùng thực?      → ZonedDateTime / cục bộ + ZoneId
Ngày + giờ chưa có múi giờ?→ LocalDateTime
```

Chương tiếp theo chuyển sang `Instant`, vì sau khi hiểu ngày-giờ cục bộ chưa phải mốc trên dòng thời gian, ta cần một kiểu đại diện cho **một thời điểm toàn cầu không mơ hồ**.
