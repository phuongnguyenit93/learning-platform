Dọn dẹp thủ công:

```java
InputStream in = Files.newInputStream(path);
try {
    return in.read();
} finally {
    in.close();
}
```

trông đơn giản nhưng có vấn đề nếu:

```text
phần thân ném A
và
close() ném B
```

Với `finally` thủ công, B có thể che A nếu mã nguồn không tự xử lý cẩn thận.

TWR có quy tắc chuẩn để giữ lỗi chính và gắn lỗi dọn dẹp dưới dạng **ngoại lệ được giữ lại (suppressed exception)**.

### So sánh

```text
finally thủ công
→ tự quản lý null, thứ tự đóng, nhiều tài nguyên, nhiều lỗi

try-with-resources
→ quyền sở hữu rõ trong cú pháp
→ thứ tự đóng được định nghĩa
→ dọn dẹp khi khởi tạo một phần bị thất bại
→ lỗi chính/suppressed exception được bảo toàn theo hợp đồng
```

TWR không thay thế mọi `finally`; `finally` vẫn hữu ích cho việc dọn dẹp không biểu diễn bằng `AutoCloseable`. Nhưng với tài nguyên do mã nguồn hiện tại sở hữu, TWR thường là lựa chọn mặc định tốt hơn.

### GHI NHỚ

```text
khai báo tài nguyên
→ quyền sở hữu/vòng đời rõ ràng

khởi tạo
→ trái sang phải

đóng
→ phải sang trái

khởi tạo giữa chừng thất bại
→ tài nguyên đã mở trước đó vẫn được đóng

phần thân + đóng tài nguyên cùng thất bại
→ cần suppressed exception
```

Phần tiếp theo đi sâu vào trường hợp thao tác chính đã thất bại mà việc dọn dẹp cũng thất bại: Java giữ cả hai lỗi như thế nào?

Việc dọn dẹp cũng có thể thất bại. Đây là bài toán khó của quản lý tài nguyên:

```text
thao tác chính đã thất bại
        +
dọn dẹp cũng thất bại
        ↓
không được làm mất lỗi nào
```

`try-with-resources` giải quyết việc này bằng khái niệm **lỗi chính (primary exception)** và **suppressed exception**.
