So sánh:

| | Xử lý Annotation khi biên dịch | Reflection |
| --- | --- | --- |
| Thời điểm | khi biên dịch | thời gian chạy |
| Mô hình chính | `Element`, `TypeMirror`, `AnnotationMirror` | `Class`, `Method`, `Field`, `AnnotatedElement` |
| Annotation `SOURCE` | đọc được | không |
| Cần class được nạp | không | có |
| Sinh mã nguồn trước khi biên dịch xong | có thể | không phải vai trò |
| Trường hợp sử dụng | kiểm tra/sinh mã | kiểm tra/gọi động ở thời gian chạy |

Điểm rất quan trọng:

> Chính sách `SOURCE` hoàn toàn hữu ích cho annotation processor.

Không nên gắn `RUNTIME` chỉ vì processor cần đọc Annotation.

### Phần tử kiểu `Class` tại thời điểm biên dịch

Với Annotation có phần tử:

```java
Class<?> target();
```

Processor không nên dựa vào việc gọi annotation proxy rồi nạp class của người dùng. Trong ngữ cảnh biên dịch, cách tổng quát và an toàn hơn là làm việc với `AnnotationMirror` / `TypeMirror`. Một số cách truy cập qua proxy có thể dẫn tới `MirroredTypeException` hoặc `MirroredTypesException` vì type đang tồn tại dưới dạng mô hình của trình biên dịch chứ chưa phải class ở thời gian chạy.
