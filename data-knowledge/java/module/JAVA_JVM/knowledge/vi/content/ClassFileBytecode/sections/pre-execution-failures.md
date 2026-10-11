Không phải mọi runtime failure đều xảy ra “trong method body”. Class-file format, verification, linking hoặc initialization có thể fail trước khi bytecode mục tiêu được thực thi.

Các nhóm lỗi người học nên phân biệt:

- biểu diễn class/version không hợp lệ hoặc không được hỗ trợ;
- verification failure;
- missing/incompatible class/member trong linkage;
- lỗi trong static initialization.

Ví dụ thực tế: ứng dụng có thể compile với một version của dependency nhưng runtime lại load version khác. Method call chưa kịp chạy đã có thể fail trong linkage vì symbolic reference không còn khớp với runtime type.

Mental model đúng là:

```text
source compiled thành công
≠ bảo đảm runtime linkage thành công
```

Chi tiết tìm kiếm class nào được load từ đâu thuộc ClassLoader/Diagnostics; ở đây ta chỉ xác định failure nằm trước execution engine.
