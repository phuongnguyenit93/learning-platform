Java ưu tiên khả năng chạy đa nền tảng và an toàn, nhưng không phải mọi khả năng đều được viết bằng Java. Nhiều hệ thống đã có thư viện native lâu đời, driver hoặc SDK chỉ cung cấp C API, và một số chức năng cấp hệ điều hành không có abstraction Java tương đương.

Native interoperability tồn tại để Java **tái sử dụng khả năng bên ngoài runtime**, thay vì buộc phải viết lại toàn bộ hệ thống. Các lý do thường gặp gồm:

- tích hợp thư viện C/C++ có sẵn;
- gọi OS API hoặc SDK phần cứng;
- trao đổi với dữ liệu native có binary layout cố định;
- dùng vùng nhớ ngoài heap khi native library cần trực tiếp đọc/ghi;
- nhúng JVM vào một ứng dụng native hiện hữu.

Native code không nên được xem là “đường tắt để nhanh hơn”. Việc vượt qua boundary có chi phí về marshalling, triển khai, ABI compatibility, gỡ lỗi và safety. Nếu một thư viện Java thuần đáp ứng được yêu cầu với độ tin cậy tương đương, giữ phần triển khai trong managed Java thường đơn giản hơn.
