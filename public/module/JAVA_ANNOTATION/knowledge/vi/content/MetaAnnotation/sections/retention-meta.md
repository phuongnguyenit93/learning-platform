`@Retention` quyết định Annotation được giữ đến giai đoạn nào:

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Audit {
    String action();
    int level() default 1;
}
```

Ba chính sách là:

```text
SOURCE  → mã nguồn/thời điểm biên dịch
CLASS   → class file, không có quy tắc Reflection ở thời gian chạy
RUNTIME → class file + Reflection ở thời gian chạy
```

Nếu annotation interface không có `@Retention`, mặc định là `CLASS`.

Điểm thiết kế quan trọng là chính sách lưu giữ thuộc **kiểu Annotation đang được gắn Meta-Annotation**. Nếu một Annotation có phần tử chứa Annotation lồng nhau, chính sách của Annotation bên ngoài không đơn giản “truyền xuống” thành chính sách độc lập cho kiểu Annotation bên trong.

Hãy chọn chính sách lưu giữ theo thành phần đọc, không theo thói quen.
