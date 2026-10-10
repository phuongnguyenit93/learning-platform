```java
@Retention(RetentionPolicy.SOURCE)
public @interface CompileNote {
}
```

Annotation có chính sách `SOURCE` chỉ cần tồn tại trong mã nguồn/mô hình lúc biên dịch và bị trình biên dịch loại bỏ khỏi biểu diễn trong class file.

Phù hợp khi siêu dữ liệu phục vụ:

- kiểm tra của trình biên dịch;
- phân tích tĩnh;
- công cụ làm việc trên mã nguồn;
- annotation processing không cần siêu dữ liệu tồn tại trong class file đầu ra.

Mô hình tư duy:

```text
.java
  @CompileNote
      ↓ trình biên dịch/bộ xử lý có thể đọc
.class
  siêu dữ liệu không còn
      ↓
Reflection ở thời gian chạy không thể đọc
```

Một annotation processor vẫn có thể xử lý Annotation `SOURCE` vì processor chạy **trong quá trình biên dịch**, trước khi siêu dữ liệu bị loại khỏi class file đầu ra.

Không nên chọn `SOURCE` nếu ứng dụng cần `getAnnotation(...)` ở thời gian chạy.
