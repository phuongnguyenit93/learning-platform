Kết thúc mô-đun, mô hình tư duy nên là:

```text
String bất biến
→ có thể chia sẻ/dùng pool
→ so sánh nội dung theo giá trị, không dựa vào định danh tham chiếu trong pool
→ StringBuilder/StringBuffer dùng khi cần bộ đệm xây chuỗi có thể thay đổi
→ char / điểm mã / cụm ký tự là các tầng biểu diễn khác nhau
→ văn bản / byte cần Charset
→ Regex mô tả mẫu
→ Text Block chỉ cải thiện cú pháp trong mã nguồn
```

Khi gặp một bài toán xử lý văn bản thực tế, hãy xác định đúng tầng trước khi chọn API:

```text
cần biểu diễn giá trị văn bản trong Java
→ String

cần xây nội dung tăng dần qua nhiều bước
→ StringBuilder / StringBuffer khi thực sự cần đặc tính đồng bộ

cần xử lý ký tự Unicode đúng tầng
→ đơn vị mã / điểm mã / cụm ký tự theo yêu cầu

cần đưa văn bản qua tệp, mạng hoặc giao thức byte
→ Charset + mã hóa/giải mã rõ ràng

cần mô tả mẫu tìm kiếm/kiểm tra
→ Regex khi String API đơn giản không đủ

cần viết String literal nhiều dòng dễ đọc hơn
→ Text Block
```

Nếu yêu cầu chuyển sang sắp xếp, so sánh hoặc phân tách văn bản theo ngôn ngữ/vùng miền, bài toán đã đi sang mô-đun **Bản địa hóa (Localization)**. Nếu yêu cầu tập trung vào đọc/ghi tệp, luồng hoặc kênh byte, phần sâu hơn thuộc mô-đun **I/O**.
