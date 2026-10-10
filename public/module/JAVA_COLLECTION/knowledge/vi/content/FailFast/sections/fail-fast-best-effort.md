Mô hình tư duy điển hình của iterator fail-fast là:

```text
tạo iterator
   ↓
ghi nhận trạng thái sửa đổi kỳ vọng
   ↓
collection bị thay đổi cấu trúc ngoài iterator
   ↓
iterator phát hiện trạng thái không còn khớp
   ↓
ConcurrentModificationException
```

JDK mô tả hành vi fail-fast theo kiểu **cố gắng phát hiện tốt nhất (best effort)**. Không thể bảo đảm tuyệt đối ngoại lệ sẽ được ném trong mọi tình huống tranh chấp hoặc mọi thời điểm. Vì vậy đoạn mã kiểu “nếu có sửa sai thì CME sẽ bảo vệ tôi” là thiết kế sai.

Fail-fast hữu ích vì nó biến một lỗi duyệt dữ liệu dễ bị che giấu thành tín hiệu rõ hơn trong lúc phát triển/gỡ lỗi. Tính đúng đắn vẫn phải đến từ việc chọn cách thay đổi dữ liệu hợp lệ hoặc chọn mô hình collection/xử lý đồng thời phù hợp.
