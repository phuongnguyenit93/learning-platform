`length()` là số đơn vị mã UTF-16 hiện có trong `StringBuilder`, tương tự cách `String.length()` được tính.

`capacity()` là dung lượng bộ đệm nội bộ hiện có trước khi cần mở rộng.

Dung lượng (capacity) là chi tiết hiệu năng hữu ích khi dự đoán đầu ra lớn, nhưng không phải một phần của nội dung String kết quả.

Đặt trước dung lượng có thể giảm số lần mở rộng/sao chép nếu biết gần đúng kích thước cuối; không cần tối ưu sớm cho chuỗi nhỏ.

### Dung lượng (capacity) không phải độ dài tối đa

```java
StringBuilder b = new StringBuilder(8);
b.append("this text is longer than eight");
```

`StringBuilder` tự mở rộng khi cần. Dung lượng ban đầu chỉ là gợi ý hiệu năng, không phải giới hạn độ dài tối đa.

Phần triển khai có chiến lược tăng dung lượng riêng; mã ứng dụng không nên phụ thuộc vào một công thức mở rộng dung lượng cụ thể.

`ensureCapacity(n)` có thể hữu ích khi biết cận dưới kích thước khá lớn, nhưng chỉ đáng dùng khi khối lượng xử lý và đo đạc thực tế cho thấy việc mở rộng/sao chép thực sự là vấn đề.

### setLength cần cẩn thận

`setLength` có thể cắt ngắn hoặc mở rộng `StringBuilder`. Khi mở rộng, vị trí mới chứa ký tự null (`\u0000`), không phải khoảng trắng. Vì vậy nó không phải API “đệm bằng khoảng trắng”.

Chương tiếp theo so `StringBuilder` với biến thể có đồng bộ hóa: `StringBuffer`.
