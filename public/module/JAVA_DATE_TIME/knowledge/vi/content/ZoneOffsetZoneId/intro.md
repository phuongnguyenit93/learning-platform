# ZoneOffset, ZoneId và quy tắc múi giờ

Khi chuyển từ ngày-giờ cục bộ sang dòng thời gian, ta cần biết đồng hồ cục bộ liên hệ với UTC như thế nào. Java có hai khái niệm rất dễ bị nhầm: `ZoneOffset` và `ZoneId`.

### Múi giờ thực ra là gì?

Trong phần mềm, một **múi giờ** không nên được hiểu đơn giản là “UTC+7” hay “UTC-5”. Với một vùng có tên, múi giờ là **tập quy tắc dùng để ánh xạ giữa dòng thời gian toàn cục và thời gian dân sự cục bộ của khu vực đó**.

Nó có thể trả lời:

```text
`Instant` này ở Paris hiển thị mấy giờ?
`LocalDateTime` này tại New York dùng độ lệch nào?
Ngày này có lần chuyển đổi DST không?
Giờ cục bộ này có tồn tại một lần, hai lần hay không tồn tại?
```

Quan hệ quan trọng:

```text
ZoneId
→ định danh bộ quy tắc của múi giờ

ZoneRules
→ chính các quy tắc thay đổi theo thời gian

ZoneOffset
→ một độ lệch cụ thể được áp dụng tại một thời điểm/ngữ cảnh
```

Vì vậy **múi giờ không đồng nghĩa với độ lệch UTC**. Độ lệch chỉ là một phần/kết quả của quy tắc tại một thời điểm.

### DST là gì? — biết trước khi gặp khoảng trống/chồng lặp

**DST (Daylight Saving Time)** là chính sách mà **một số** quốc gia/khu vực thay đổi độ lệch UTC hoặc đồng hồ cục bộ trong một phần của năm. Không phải nơi nào cũng dùng DST, và quy tắc có thể thay đổi theo quyết định pháp lý.

Khi đồng hồ đổi vì một lần chuyển đổi độ lệch theo quy tắc múi giờ, có hai tình huống người mới cần biết tên trước:

```text
gap
→ đồng hồ nhảy về phía trước
→ một khoảng giờ cục bộ không tồn tại

overlap
→ đồng hồ quay lại
→ một khoảng giờ cục bộ xuất hiện hai lần với hai độ lệch khác nhau
```

Đây là lý do `LocalDateTime + ZoneId` đôi khi không ánh xạ đơn giản 1:1 tới `Instant`. Chưa cần nhớ cách Java phân giải ở đây; các chương tiếp theo sẽ xây dần mô hình, và chương **Phép toán / So sánh** sẽ xử lý chi tiết khoảng trống/chồng lặp.
