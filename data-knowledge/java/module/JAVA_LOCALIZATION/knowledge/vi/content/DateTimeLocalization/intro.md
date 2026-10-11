# Bản địa hóa ngày giờ theo Locale

Ngày giờ là nơi `Locale` và `ZoneId` rất dễ bị trộn lẫn. Một cái quyết định **quy ước trình bày**, cái kia quyết định **quan hệ giữa thời điểm tuyệt đối (instant) và giờ địa phương**.

**Bản địa hóa ngày giờ** nghĩa là biến một giá trị ngày/giờ thành cách viết mà người dùng của một Locale quen đọc — ví dụ thứ tự ngày/tháng/năm, tên tháng, tên ngày trong tuần và độ dài của phần hiển thị.

Một luồng xử lý ngày giờ đầy đủ có thể gồm:

```text
giá trị thời gian
→ LocalDate / LocalDateTime / Instant / ZonedDateTime...

ZoneId (nếu cần chuyển từ instant sang giờ địa phương)
→ quyết định ngày/giờ địa phương nào đang được nói tới

Locale
→ quyết định quy ước ngôn ngữ/vùng

DateTimeFormatter + kiểu/mẫu
→ tạo String cuối cùng
```

Vì vậy bản địa hóa ngày giờ **không thay đổi bản chất thời gian**; nó thay đổi cách thời gian đã được xác định được trình bày cho con người.
