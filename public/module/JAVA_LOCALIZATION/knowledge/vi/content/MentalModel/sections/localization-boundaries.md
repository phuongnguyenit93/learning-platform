Bản địa hóa chủ yếu thuộc **ranh giới giao tiếp với con người**.

Ví dụ phù hợp:

```text
UI / phản hồi Web cho người dùng
→ thông điệp đã dịch
→ số, phần trăm, tiền tệ đã định dạng
→ ngày giờ đã định dạng

email / báo cáo / hóa đơn
→ văn bản + số/ngày giờ/tiền tệ theo Locale người nhận

sắp xếp danh sách tên cho người dùng
→ Collator theo ngôn ngữ
```

Ngược lại, dữ liệu phục vụ máy thường cần định dạng ổn định, không phụ thuộc môi trường:

```text
giá trị số trong cơ sở dữ liệu
hợp đồng API dành cho máy
khóa bộ nhớ đệm
định danh giao thức
trường log dùng để phân tích tự động
```

Ví dụ không nên dùng Locale mặc định để tạo định danh:

```java
String key = input.toLowerCase(); // phụ thuộc Locale mặc định
```

Nếu dữ liệu thật sự cần trung lập với Locale, cần biểu đạt ý định rõ:

```java
String key = input.toLowerCase(Locale.ROOT);
```

### Lộ trình của mô-đun theo ROADMAP

Sau chương này, hãy nhìn 13 chương chi tiết như phần triển khai của 9 cột mốc trong ROADMAP:

```text
1. Mô hình tư duy về bản địa hóa
→ hiểu i18n/l10n và tách dữ liệu nghiệp vụ khỏi cách trình bày
        ↓
2. Locale và thẻ ngôn ngữ
→ biểu diễn ngữ cảnh ngôn ngữ, trao đổi BCP 47 và chọn Locale được hỗ trợ
        ↓
3. ResourceBundle và tài nguyên bản địa hóa
→ tổ chức và tìm đúng tài nguyên theo Locale
        ↓
4. Thông điệp bản địa hóa có tham số
→ dùng MessageFormat để giữ cấu trúc câu trong tài nguyên dịch
        ↓
5. Số và tiền tệ theo Locale
→ định dạng/phân tích số, đồng thời giữ Currency tách khỏi Locale
        ↓
6. So sánh và sắp xếp văn bản theo Locale
→ dùng Collator khi thứ tự dành cho người đọc quan trọng
        ↓
7. Bản địa hóa ngày giờ theo Locale
→ định dạng/phân tích và các quy ước lịch, nhưng không trộn Locale với ZoneId
        ↓
8. Phân tách văn bản và văn bản hai chiều
→ dùng BreakIterator cho ranh giới văn bản và Bidi cho thứ tự logic/hướng viết
        ↓
9. Cơ chế dự phòng, Locale mặc định, các lỗi thường gặp và tổng hợp
→ hiểu cơ chế dự phòng/Locale mặc định và giữ dữ liệu dành cho máy độc lập với bản địa hóa
```

Mục tiêu của mô-đun không phải là “học thuộc các lớp trong `java.util` và `java.text`”. Mục tiêu là biết **giá trị nào phải giữ độc lập với Locale, ở ranh giới nào mới áp dụng bản địa hóa, và chọn đúng API Java để tạo cách trình bày đó**.
