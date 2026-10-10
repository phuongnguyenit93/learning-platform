API chuẩn trải trên hai package chính:

- `javax.annotation.processing` — vòng đời và dịch vụ của annotation processor;
- `javax.lang.model` — mô hình khai báo/type mà trình biên dịch cung cấp cho processor.

Một processor thường kế thừa `AbstractProcessor`:

```java
public final class MapperProcessor extends AbstractProcessor {

    @Override
    public boolean process(
            Set<? extends TypeElement> annotations,
            RoundEnvironment roundEnv) {

        // đọc mô hình tại thời điểm biên dịch
        return true;
    }
}
```

Trước khi dùng các API đó, hãy có mô hình tư duy:

```text
Element
→ một khai báo trong mã nguồn/mô hình, ví dụ class, method, field, parameter

TypeElement
→ Element đại diện cho khai báo type như class/interface/record/annotation interface

TypeMirror
→ biểu diễn một Java type tại thời điểm biên dịch

AnnotationMirror
→ biểu diễn một Annotation trong mô hình của trình biên dịch

Elements
→ dịch vụ tiện ích để truy vấn mô hình khai báo

Types
→ dịch vụ tiện ích để truy vấn/so sánh mô hình type
```

Processor được khởi tạo bằng `ProcessingEnvironment`, từ đó truy cập:

- `Elements` — dịch vụ tiện ích cho mô hình khai báo;
- `Types` — dịch vụ tiện ích cho mô hình type;
- `Messager` — phát thông báo chẩn đoán của trình biên dịch;
- `Filer` — sinh mã nguồn/class file/tài nguyên;
- các tùy chọn và thông tin phiên bản mã nguồn.

### Giá trị trả về của `process()`

`process(...)` trả về:

```text
true
→ processor nhận quyền xử lý (claim) các kiểu Annotation được đưa vào
→ processor sau không tiếp tục được hỏi về chính tập đã được processor trước nhận xử lý

false
→ Annotation chưa bị processor nhận quyền xử lý
→ processor khác vẫn có thể xử lý
```

Vì vậy “luôn trả về `true`” không phải thực hành mặc định tốt. Việc nhận quyền xử lý (claim) là **quy tắc phối hợp** giữa các processor.

Processor làm việc với mô hình tại thời điểm biên dịch như `Element`, `TypeMirror`, `AnnotationMirror`; nó không nên giả định class của ứng dụng đã được nạp thành `Class<?>` ở thời gian chạy.
