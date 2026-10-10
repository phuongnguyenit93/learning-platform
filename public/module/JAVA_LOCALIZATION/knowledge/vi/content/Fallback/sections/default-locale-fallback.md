Ngoài danh sách ứng viên của Locale được yêu cầu, cơ chế `ResourceBundle` mặc định còn có thể tham chiếu **Locale mặc định của JVM** như một nhánh dự phòng khi không tìm được gói tài nguyên phù hợp cho Locale đích.

Đây là lý do Locale mặc định có thể trở thành **phụ thuộc ẩn** nguy hiểm.

Ví dụ:

```text
yêu cầu muốn fr-FR
        ↓
không có gói tài nguyên tiếng Pháp phù hợp
        ↓
Locale mặc định của JVM là en-US
        ↓
có thể đi qua nhánh ứng viên tiếng Anh theo chính sách dự phòng
```

Ứng dụng có thể “không lỗi” nhưng người dùng lại nhận nội dung bằng ngôn ngữ không mong đợi.

Trong hệ thống cần chính sách chặt chẽ, có thể tùy biến `ResourceBundle.Control` để kiểm soát cơ chế dự phòng:

```java
ResourceBundle.Control control = ResourceBundle.Control.getNoFallbackControl(
        ResourceBundle.Control.FORMAT_DEFAULT
);

ResourceBundle bundle = ResourceBundle.getBundle(
        "Messages",
        locale,
        control
);
```

Đừng tùy biến chỉ vì API cho phép; hãy bắt đầu từ quy tắc sản phẩm: Locale không được hỗ trợ thì dùng ngôn ngữ dự phòng nào, gói tài nguyên gốc nào, hay trả lỗi?
