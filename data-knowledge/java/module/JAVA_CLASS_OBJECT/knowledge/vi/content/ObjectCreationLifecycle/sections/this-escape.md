Rủi ro thường gọi là `this escape` xảy ra khi tham chiếu tới đối tượng đang được khởi tạo bị chia sẻ ra bên ngoài trước khi quá trình khởi tạo hoàn tất.

Ví dụ rủi ro:

```java
registry.add(this);
```

trong hàm khởi tạo, hoặc đăng ký listener/callback có thể chạy ngay.

Mã bên ngoài có thể quan sát đối tượng ở trạng thái chưa hoàn chỉnh. Trong mã chạy đồng thời, việc công bố đối tượng quá sớm còn gây vấn đề về khả năng nhìn thấy trạng thái giữa các luồng.

Chương tiếp theo chuyển từ quá trình tạo đối tượng sang cách tổ chức kiểu: **khi nào một lớp nên được đặt bên trong lớp khác và lớp nội bộ giữ ngữ cảnh gì?**
