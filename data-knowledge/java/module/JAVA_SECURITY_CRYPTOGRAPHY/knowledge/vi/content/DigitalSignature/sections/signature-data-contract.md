Signature bảo vệ **bytes được ký**, không bảo vệ “ý nghĩa mà con người nghĩ là đã ký”.

Nếu bên tạo dữ liệu ký JSON bytes nhưng bên nhận parse rồi serialize lại trước khi verify, khác biệt về whitespace, thứ tự field hoặc cách biểu diễn Unicode có thể làm verification thất bại. Ngược lại, nếu protocol chỉ ký một tập field nhưng business logic tin toàn object, kẻ tấn công có thể sửa field không nằm trong dữ liệu đã ký.

Protocol cần xác định:

- exact payload hoặc canonical form;
- domain/context/version để tránh dùng signature ở ngữ cảnh khác;
- key/certificate identity nào được phép ký;
- cách xử lý replay nếu replay là threat.

Signature API không tự thiết kế data contract thay ứng dụng.
