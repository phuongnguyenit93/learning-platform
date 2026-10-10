# Điều kiện kích hoạt và lỗi khi khởi tạo class

Ở chương Lifecycle ta đã tách:

```text
loading
→ linking
→ initialization
```

Chương này tập trung vào khởi tạo (initialization) vì đây là nơi các tác dụng phụ thật sự dễ xuất hiện: bộ khởi tạo trường static, khối `static`, đăng ký, tạo bộ nhớ đệm hoặc lỗi trong lúc class khởi động.

Đối với hệ thống plugin, hiểu khởi tạo giúp khung phần mềm **nạp/kiểm tra kiểu plugin mà chưa chạy mã `static` của plugin**, rồi chỉ khởi tạo khi thật sự quyết định dùng.
