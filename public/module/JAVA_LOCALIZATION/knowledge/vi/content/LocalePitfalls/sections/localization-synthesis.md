Sau khi học các API riêng lẻ, cách ra quyết định nên quay về một luồng thống nhất thay vì bắt đầu từ tên lớp:

```text
1. Xác định giá trị gốc có ý nghĩa nghiệp vụ gì
   → số, tiền tệ, thời điểm, trạng thái, định danh...
        ↓
2. Xác định dữ liệu đang đi tới con người hay tới máy
   → ranh giới trình bày hay ranh giới cần biểu diễn ổn định?
        ↓
3. Nếu dành cho con người, xác định Locale tường minh
   → lựa chọn người dùng / thông tin từ yêu cầu / chính sách sản phẩm
        ↓
4. Chọn đúng cơ chế
   → ResourceBundle / MessageFormat
   → NumberFormat / Currency
   → DateTimeFormatter + ZoneId
   → Collator / BreakIterator / Bidi khi bài toán văn bản cần chúng
        ↓
5. Kiểm soát cơ chế dự phòng và Locale mặc định
   → không để môi trường JVM âm thầm quyết định hành vi
        ↓
6. Giữ biểu diễn dành cho máy ổn định
   → không lưu chuỗi đã bản địa hóa làm giá trị nghiệp vụ, định danh hoặc định dạng giao thức
```

Nếu một bước trong chuỗi này không rõ, vấn đề thường nằm ở **ranh giới trách nhiệm** chứ không phải ở việc thiếu thêm một bộ định dạng.

Nếu chỉ nhớ một nguyên tắc sau mô-đun này, hãy nhớ:

```text
Ý nghĩa nghiệp vụ phải ổn định.
Locale chỉ nên thay đổi cách con người nhìn thấy ý nghĩa đó.
```
