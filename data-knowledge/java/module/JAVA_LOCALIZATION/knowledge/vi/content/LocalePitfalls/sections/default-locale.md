Java có Locale mặc định ở mức JVM:

```java
Locale current = Locale.getDefault();
```

Giá trị mặc định này tiện cho ứng dụng chạy cục bộ, nhưng trong hệ thống phía máy chủ phục vụ nhiều người dùng nó có thể trở thành **phụ thuộc ẩn**: cùng một đoạn mã nhưng chạy trên máy có cấu hình khác sẽ cho kết quả khác.

Java phân biệt hai nhóm mặc định quan trọng:

```java
Locale.Category.DISPLAY
→ dùng khi cần hiển thị tên ngôn ngữ/quốc gia/Locale

Locale.Category.FORMAT
→ dùng cho định dạng số/ngày giờ/tiền tệ...
```

Đọc riêng từng nhóm:

```java
Locale displayLocale = Locale.getDefault(Locale.Category.DISPLAY);
Locale formatLocale = Locale.getDefault(Locale.Category.FORMAT);
```

Có thể thay đổi Locale mặc định:

```java
Locale.setDefault(Locale.Category.FORMAT, Locale.US);
```

Nhưng đây là trạng thái ở mức JVM và có thể ảnh hưởng mã khác trong cùng tiến trình. Hệ thống phía máy chủ thường an toàn hơn khi truyền `Locale` **tường minh** theo ngữ cảnh yêu cầu/người dùng thay vì thay đổi giá trị mặc định toàn cục.
