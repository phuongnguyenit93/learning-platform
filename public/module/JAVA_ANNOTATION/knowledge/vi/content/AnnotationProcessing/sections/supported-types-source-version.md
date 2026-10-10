Processor phải công bố các kiểu Annotation mà nó hỗ trợ:

```java
@SupportedAnnotationTypes("com.example.GenerateMapper")
@SupportedSourceVersion(SourceVersion.RELEASE_21)
public final class MapperProcessor extends AbstractProcessor {
}
```

Hoặc override API tương ứng.

Hai thông tin này có ý nghĩa khác nhau:

```text
các kiểu Annotation được hỗ trợ
→ processor quan tâm Annotation nào

phiên bản mã nguồn được hỗ trợ
→ processor hiểu mức ngôn ngữ/mã nguồn đến đâu
```

`@SupportedSourceVersion` không phải cách đổi mức tương thích mã nguồn của project. Nó chỉ mô tả khả năng của processor.

Processor có thể hỗ trợ wildcard `"*"`. Processor kiểu này có ngữ nghĩa đặc biệt và có thể được gọi ngay cả khi không có Annotation phù hợp xuất hiện, nên chỉ dùng khi thật sự cần.

### Bộ xử lý được trình biên dịch tìm thấy bằng cách nào?

Processor cũng là mã Java, nên nó phải **được biên dịch trước** và có mặt trên processor path/cấu hình build trước khi nó có thể xử lý mã nguồn của ứng dụng.

Mô hình tư duy:

```text
mã nguồn processor
→ biên dịch thành thư viện/JAR của processor
        ↓
công cụ build / javac đưa thư viện lên processor path
        ↓
javac phát hiện processor
        ↓
processor được khởi tạo
        ↓
process(...) chạy qua các vòng
```

Trình biên dịch có thể biết processor bằng các cách như:

- đăng ký service provider, ví dụ `META-INF/services/javax.annotation.processing.Processor`;
- khai báo Java module bằng `provides ... with ...`;
- cấu hình processor tường minh của trình biên dịch/công cụ build.

Vì vậy chỉ viết một class `extends AbstractProcessor` trong mã nguồn ứng dụng **không tự động đảm bảo** processor đó sẽ chạy.

### Tùy chọn của bộ xử lý với `@SupportedOptions`

Processor có thể công bố các tùy chọn mà nó hiểu:

```java
@SupportedOptions("mapper.debug")
@SupportedAnnotationTypes("com.example.GenerateMapper")
@SupportedSourceVersion(SourceVersion.RELEASE_21)
public final class MapperProcessor extends AbstractProcessor {
}
```

Trình biên dịch/công cụ build có thể truyền tùy chọn theo dạng tương đương:

```text
-Amapper.debug=true
```

Processor đọc chúng qua:

```java
String debug =
    processingEnv.getOptions().get("mapper.debug");
```

Tùy chọn là **đầu vào của processor**, không phải phần tử Annotation. Dùng tùy chọn cho cấu hình ở cấp build; dùng phần tử Annotation cho siêu dữ liệu gắn với một khai báo/type cụ thể.
