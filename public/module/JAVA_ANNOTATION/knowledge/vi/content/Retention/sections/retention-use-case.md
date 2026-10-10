Thay vì mặc định dùng `RUNTIME`, hãy bắt đầu từ thành phần đọc:

| Thành phần đọc cần siêu dữ liệu ở đâu? | Chính sách phù hợp |
| --- | --- |
| Chỉ mã nguồn/trình biên dịch/phân tích tĩnh | `SOURCE` |
| Class file/công cụ bytecode | `CLASS` |
| Reflection/framework ở thời gian chạy | `RUNTIME` |

Ví dụ:

```text
@GeneratedHint cho bộ xử lý mã nguồn
→ SOURCE có thể đủ

@BytecodeRule cho class-file transformer
→ CLASS

@Audit được interceptor/mã chạy ở thời gian chạy đọc
→ RUNTIME
```

### Đánh đổi thiết kế

Giữ siêu dữ liệu lâu hơn mức cần thiết không tự động tốt hơn. Nó làm quy tắc rộng hơn và có thể khiến người dùng hiểu rằng kiểm tra lúc chạy là một phần của API.

Ngược lại, chính sách lưu giữ quá ngắn làm siêu dữ liệu biến mất trước khi thành phần đọc cần nó.

Quy tắc thực dụng:

```text
xác định thành phần đọc
→ xác định giai đoạn thành phần đó chạy
→ chọn chính sách lưu giữ ngắn nhất vẫn đáp ứng nhu cầu
```

### @Retention và xử lý Annotation tại thời điểm biên dịch

Annotation processor chạy trong quá trình biên dịch nên có thể xử lý Annotation mà mã ở thời gian chạy sẽ không bao giờ thấy. Đây là khác biệt nền tảng:

```text
xử lý tại thời điểm biên dịch
≠
Reflection tại thời gian chạy
```

Ta sẽ đi sâu vào xử lý Annotation tại thời điểm biên dịch ở một chương phía sau. Chương tiếp theo giải quyết một khía cạnh độc lập còn lại: **Annotation được phép xuất hiện ở đâu?**
