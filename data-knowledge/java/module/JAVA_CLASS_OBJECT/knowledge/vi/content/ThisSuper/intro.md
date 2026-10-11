# this, super và chuỗi khởi tạo

Trong mã chạy trên một đối tượng cụ thể, Java cần cách nói rõ **đối tượng hiện tại** và **ngữ cảnh của lớp cha**. Hai từ khóa `this` và `super` phục vụ đúng vai trò đó.

Lý do thực tế là quá trình khởi tạo và truy cập thành viên cần đi qua nhiều ngữ cảnh: một hàm khởi tạo có thể tái sử dụng hàm khởi tạo khác trong cùng lớp, còn lớp con phải khởi tạo phần thuộc lớp cha của chính đối tượng đó trước khi hoàn thiện trạng thái riêng.
