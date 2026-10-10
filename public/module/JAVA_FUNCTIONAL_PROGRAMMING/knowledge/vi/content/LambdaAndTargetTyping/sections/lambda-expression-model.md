Biểu thức lambda là cú pháp Java dùng để cung cấp hành vi cho một giao diện hàm tương thích.

```java
Predicate<String> nonEmpty = text -> !text.isEmpty();
```

Phần `text -> !text.isEmpty()` không tự khai báo một phương thức có tên và cũng không tự tạo ra một kiểu hàm độc lập. Kiểu đích `Predicate<String>` ở bên ngoài cho trình biên dịch biết lambda nhận `String` và phải tạo ra kết quả `boolean`.

Khi biểu thức lambda được đánh giá, kết quả là một giá trị tham chiếu tới thực thể của kiểu giao diện hàm đích. Java không bảo đảm mỗi lần đánh giá đều cấp phát một đối tượng mới, vì vậy mã nên phụ thuộc vào hợp đồng giao diện thay vì dựa vào lớp hiện thực tại thời điểm chạy hoặc danh tính đối tượng.

Mô hình tư duy quan trọng là: **lambda chỉ có nghĩa đầy đủ khi đặt trong một ngữ cảnh cung cấp giao diện hàm đích**.
