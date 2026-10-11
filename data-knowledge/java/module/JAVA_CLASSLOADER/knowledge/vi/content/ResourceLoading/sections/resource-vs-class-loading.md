Ví dụ plugin xuyên suốt đến đây có hai không gian tìm kiếm song song:

```text
class lookup
→ binary class name
→ ClassLoader

resource lookup
→ resource name/path
→ Class / ClassLoader resource API
```

Resource lookup không tự initialize class. Chương tiếp theo quay lại lifecycle để xem chính xác static initialization diễn ra ra sao, được khóa thế nào và lỗi khởi tạo để lại trạng thái gì.
