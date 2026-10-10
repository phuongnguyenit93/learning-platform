# Ngày và thời gian là gì, vì sao cần nhiều mô hình?

Ngày-giờ nhìn qua có vẻ đơn giản vì con người sử dụng ngày và giờ mỗi ngày. Nhưng trong phần mềm, câu “lưu thời gian” có thể đang nói về nhiều thứ hoàn toàn khác nhau:

```text
Ngày sinh của một người
→ cần ngày trên lịch

Giờ mở cửa 08:30
→ cần giờ trong ngày

Cuộc họp 2026-10-05 lúc 09:00 tại Hà Nội
→ cần ngày + giờ địa phương + quy tắc múi giờ

Một yêu cầu đến máy chủ tại đúng thời điểm nào
→ cần một mốc không mơ hồ trên dòng thời gian toàn cục
```

Nếu gom tất cả các ý nghĩa đó vào một biến tên `timestamp`, mã có thể vẫn biên dịch nhưng nghiệp vụ đã bị mô hình hóa sai. Mục tiêu đầu tiên của mô-đun này vì thế không phải học thuộc lớp, mà là biết **bài toán đang nói về loại thời gian nào**.

Ta sẽ dùng một ví dụ xuyên suốt: hệ thống đặt lịch họp. Người dùng nhập ngày, giờ và khu vực; hệ thống cần hiển thị lại đúng theo nơi người dùng ở, đồng thời lưu được một thời điểm toàn cầu rõ ràng khi cuộc họp đã được xác định.
