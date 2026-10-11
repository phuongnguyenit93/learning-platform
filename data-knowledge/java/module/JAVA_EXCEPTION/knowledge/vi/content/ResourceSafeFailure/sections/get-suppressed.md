API:

```java
Throwable[] suppressed = ex.getSuppressed();
```

Một exception có thể có **nhiều** lỗi bị giữ lại dưới dạng suppressed.

Ví dụ ba tài nguyên:

```text
A mở trước
B mở sau
C mở cuối
```

Khi phần thân đã thất bại, quá trình đóng diễn ra:

```text
C → B → A
```

Nếu `C.close()` và `A.close()` cùng thất bại:

```text
lỗi từ phần thân
→ lỗi chính

lỗi khi đóng C
→ suppressed

lỗi khi đóng A
→ suppressed
```

Thứ tự trong dữ liệu chẩn đoán suppressed phản ánh các lỗi dọn dẹp được ghi nhận trong quá trình đóng.

### Suppressed exception khác Cause

Hai khái niệm trả lời hai câu hỏi khác nhau:

```text
cause
→ lỗi nào dẫn tới exception hiện tại theo chuỗi nguyên nhân/chuyển đổi?

suppressed
→ lỗi phụ nào xảy ra trong lúc một lỗi khác đã là kết quả chính?
```

Ví dụ:

```text
RuntimeException
cause
└── IOException

IOException
suppressed
└── lỗi khi đóng tài nguyên
```

Một throwable có thể vừa có `cause` vừa có suppressed exceptions.

> Chi tiết nâng cao: một lớp con của `Throwable` có thể tắt cơ chế suppression qua constructor được bảo vệ của `Throwable`. Khi đó suppressed exception sẽ không được ghi lại. Đây là trường hợp biên dành cho người viết thư viện; mô hình mặc định của các exception thông thường vẫn là suppression được bật.

### Logic nghiệp vụ có nên phụ thuộc vào suppressed?

Thông thường không.

Suppressed exception chủ yếu phục vụ **ngữ cảnh chẩn đoán**. Logic nghiệp vụ nên dựa vào hợp đồng, kiểu exception hoặc dữ liệu có cấu trúc rõ ràng hơn, thay vì quy tắc kiểu “nếu có đúng 2 suppressed exception thì làm X”.
