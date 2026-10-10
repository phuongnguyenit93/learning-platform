Không nên dùng các khẩu quyết máy móc như:

```text
exception nghiệp vụ = checked
Java hiện đại = unchecked
```

Thay vào đó, bắt đầu từ trách nhiệm của bên gọi.

### CÂU HỎI THIẾT KẾ

```text
Bên gọi có khả năng xử lý lỗi này theo cách có ý nghĩa không?
        ↓
Có cần buộc mọi bên gọi phải quyết định ngay tại thời điểm biên dịch không?
        ↓
Thông tin trong `throws` làm API rõ hơn hay chỉ tạo mã lặp lại?
        ↓
Lỗi này là một khả năng vận hành có thể phục hồi,
hay phản ánh việc vi phạm hợp đồng/bất biến (invariant)?
```

Ví dụ, cùng là “không đọc được dữ liệu” nhưng chính sách xử lý có thể khác:

```text
ứng dụng trên máy tính đọc file do người dùng chọn
→ IOException có thể giúp bên gọi yêu cầu người dùng chọn lại file

tầng dịch vụ nội bộ gọi tầng repository
→ có thể chuyển đổi sang exception của ứng dụng và xử lý ở ranh giới cao hơn
```

Không có lựa chọn đúng cho mọi hệ thống. Điều quan trọng là **loại exception phải phục vụ chính sách xử lý của API**.

### SO SÁNH TẠI THỜI ĐIỂM BIÊN DỊCH

```java
void checked() throws IOException {
    throw new IOException("disk failure");
}

void unchecked() {
    throw new IllegalStateException("invalid state");
}
```

Bên gọi của `checked()` buộc phải bắt hoặc khai báo `IOException`. Bên gọi của `unchecked()` không bị trình biên dịch áp quy tắc đó.

### GHI NHỚ

```text
checked
→ trình biên dịch buộc lỗi xuất hiện trong quyết định của bên gọi

unchecked
→ trình biên dịch không buộc, nhưng lỗi vẫn tồn tại khi chương trình chạy
```

Chương tiếp theo tách hai keyword dễ nhầm: `throw` thực sự **ném một Throwable**, còn `throws` **mô tả khả năng exception thoát khỏi phương thức**.
