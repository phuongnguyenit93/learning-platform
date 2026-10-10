Gói tài nguyên gốc không có hậu tố Locale:

```text
Messages.properties
```

Nó có thể đóng vai trò tập tài nguyên tổng quát cuối cùng. Tuy nhiên với chính sách mặc định, đừng suy luận rằng Java luôn “trả gói gốc ngay” trước khi xem xét nhánh Locale dự phòng; việc chọn gói tài nguyên cuối cùng còn phụ thuộc toàn bộ thuật toán của `ResourceBundle.Control`.

Có hai chiến lược phổ biến:

```text
Chiến lược A
gói tài nguyên gốc = ngôn ngữ mặc định thực tế, ví dụ tiếng Anh

Chiến lược B
gói tài nguyên gốc = tập giá trị dự phòng tối thiểu/an toàn cho kỹ thuật
các gói theo Locale chứa nội dung ngôn ngữ đầy đủ
```

Điều quan trọng là chiến lược phải **nhất quán và được kiểm thử**. Nếu gói gốc chứa tiếng Anh nhưng nhóm phát triển tưởng nó “trung lập theo Locale”, bản dịch bị thiếu có thể âm thầm hiện tiếng Anh ở giao diện của ngôn ngữ khác.

Khóa được tìm qua chuỗi cha của gói tài nguyên đã được phân giải. Vì vậy một gói theo Locale không nhất thiết phải sao chép toàn bộ khóa nếu gói cha/gốc đã cung cấp giá trị — nhưng sản phẩm vẫn có thể yêu cầu đầy đủ 100% và kiểm tra bằng kiểm thử/kiểm tra trong quá trình xây dựng.
