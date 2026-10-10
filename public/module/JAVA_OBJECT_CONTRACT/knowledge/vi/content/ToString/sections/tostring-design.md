Một `toString` tốt thường:

- ngắn gọn nhưng đủ thông tin;
- hiển thị các trường dữ liệu quan trọng cho chẩn đoán;
- có kết quả xác định hoặc ít nhất đủ ổn định để con người đọc;
- không thực hiện I/O mạng, cơ sở dữ liệu hoặc tệp;
- không thực hiện tính toán tốn kém;
- hạn chế ném ngoại lệ trong lúc ghi log hoặc gỡ lỗi.

### BIỂU DIỄN VĂN BẢN KHÔNG PHẢI TUẦN TỰ HÓA DỮ LIỆU

Hai mục tiêu khác nhau:

```text
toString
→ biểu diễn chẩn đoán dành cho con người

JSON / protobuf / bộ tuần tự hóa chuyên dụng
→ định dạng dành cho máy với lược đồ (schema) và chính sách tương thích riêng
```

Không nên phân tích ngược `toString()` để tái tạo đối tượng trừ khi lớp đó **công bố rõ ràng** một quy ước như vậy. Với lớp nghiệp vụ thông thường, định dạng `toString` có thể thay đổi khi nhu cầu gỡ lỗi thay đổi.

### GIỮ KẾT QUẢ HỮU ÍCH, KHÔNG IN TOÀN BỘ MỌI THỨ

Ví dụ một `Book` có hàng chục trường dữ liệu nhưng log thường chỉ cần:

```java
@Override
public String toString() {
    return "Book[id=" + id + ", title=" + title + "]";
}
```

In toàn bộ đồ thị đối tượng lớn có thể làm log nhiễu, chậm và khó đọc.

### CẨN THẬN VỚI ĐỒ THỊ ĐỐI TƯỢNG ĐỆ QUY

Nếu hai đối tượng trỏ lẫn nhau và cả hai `toString` đều in toàn bộ đối tượng còn lại, biểu diễn có thể đệ quy vô hạn hoặc tạo kết quả rất lớn.

```text
Parent.toString()
→ in Child
   → Child.toString()
      → lại in Parent
         → ...
```

Vì vậy nên chọn trường dữ liệu cần biểu diễn có chủ ý thay vì tự động in toàn bộ đồ thị đối tượng.

### RECORD VÀ BIỂU DIỄN ĐƯỢC TẠO TỰ ĐỘNG

Java record cung cấp `toString` tự động dựa trên các thành phần (`component`). Điều đó tiện lợi cho kiểu dữ liệu chuyên chở giá trị, nhưng vẫn cần xem xét ranh giới bảo mật và ghi log. “Được sinh tự động” không đồng nghĩa “an toàn để log ở mọi nơi”.
