# Xử lý Exception với try/catch/finally

Sự lan truyền cho phép lỗi đi lên ngăn xếp lời gọi. `try/catch/finally` cho phép một tầng quyết định ba việc khác nhau:

```text
try
→ vùng mã nguồn có thể phát sinh lỗi

catch
→ xử lý một nhóm lỗi cụ thể

finally
→ thực hiện công việc bắt buộc khi rời vùng try/catch
```

Điểm khó không nằm ở cú pháp, mà ở **thứ tự luồng điều khiển** khi chạy thành công, phát sinh exception, `return` và dọn dẹp tương tác với nhau.
