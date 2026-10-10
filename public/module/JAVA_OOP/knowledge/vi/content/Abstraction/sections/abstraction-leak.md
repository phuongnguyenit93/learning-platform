### KHÁI NIỆM — rò rỉ trừu tượng là gì?

Abstraction bị **rò rỉ (leak)** khi bên sử dụng vẫn phải hiểu chi tiết triển khai mới có thể dùng hợp đồng đúng cách.

Ví dụ một API tưởng như đơn giản:

```java
interface ReportStore {
    void save(Report report);
}
```

nhưng nếu bên gọi phải tự biết rằng cách triển khai A chỉ chấp nhận tên file không dấu, cách triển khai B yêu cầu gọi `flush()` trước khi kết thúc, còn cách triển khai C có giới hạn kích thước không được nói trong hợp đồng, thì trừu tượng hóa đã không che được những chi tiết cần thiết để sử dụng đúng.

Ví dụ:

- API chỉ nói `save`, nhưng bên gọi phải biết nhà cung cấp cụ thể mới xử lý lỗi đúng;
- collection che giấu cách lưu dữ liệu nhưng hiệu năng thay đổi rất lớn theo cách triển khai;
- lớp trừu tượng cho tài nguyên che vòng đời đến mức bên gọi không biết phải `close`;
- hợp đồng không nói gì về thứ tự phần tử hoặc tính an toàn khi chạy đa luồng (`thread-safety`) dù chúng ảnh hưởng trực tiếp tới tính đúng đắn.

### VÌ SAO — không trừu tượng nào che được mọi chi tiết

Mục tiêu của trừu tượng hóa không phải là giấu tất cả.

Những ràng buộc ảnh hưởng tới:

- tính đúng đắn;
- cách xử lý lỗi;
- vòng đời;
- hiệu năng quan trọng;

nên được công khai hoặc ghi rõ trong hợp đồng.

Chỉ những chi tiết triển khai không liên quan mới nên được giấu đi.

### PHÂN BIỆT — trừu tượng hóa, đóng gói và che giấu thông tin

Ba ý này liên quan nhưng có trọng tâm khác nhau:

```text
Trừu tượng hóa (Abstraction)
→ chọn mô hình/hợp đồng tối thiểu mà bên gọi cần suy nghĩ tới

Đóng gói (Encapsulation)
→ đặt trạng thái + hành vi sau một ranh giới được kiểm soát

Che giấu thông tin (Information hiding)
→ che những quyết định thiết kế có khả năng thay đổi để bên gọi không phụ thuộc không cần thiết
```

Trong mã thực tế chúng thường hỗ trợ nhau, nhưng hiểu khác biệt giúp tránh suy luận sai rằng chỉ cần `private` hoặc `interface` là tự động có một trừu tượng tốt.
