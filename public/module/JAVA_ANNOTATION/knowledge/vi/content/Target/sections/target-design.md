`@Target` là một phần của quy tắc công khai của Annotation. Hãy chọn **tập ngữ cảnh nhỏ nhất vẫn diễn đạt đúng ý nghĩa**.

Ví dụ:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audit {
    String action();
    int level() default 1;
}
```

rõ hơn:

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Audit {
    String action();
    int level() default 1;
}
```

nếu thành phần đọc chỉ xử lý method.

Lợi ích:

- trình biên dịch chặn vị trí sử dụng vô nghĩa;
- IDE gợi ý và hiển thị ngữ cảnh rõ hơn;
- thành phần đọc không phải xử lý nhiều trường hợp không cần thiết;
- quy tắc của Annotation dễ đọc và dễ tiến hóa.

### Nhiều target làm mở rộng bề mặt API

Khi thêm `FIELD` hoặc `TYPE` vào một Annotation đã public, bạn đang mở rộng nơi siêu dữ liệu có thể xuất hiện. Thành phần đọc cần có ngữ nghĩa rõ cho những ngữ cảnh mới đó.

Đặc biệt với `RECORD_COMPONENT`, Java có các quy tắc ánh xạ record component sang component field, accessor và parameter của canonical constructor. Annotation trên record component có thể được truyền sang component field tương ứng và sang accessor/canonical-constructor parameter **được khai báo ngầm** khi kiểu Annotation cũng áp dụng được ở ngữ cảnh tương ứng. Nó không tự được sao chép sang accessor do lập trình viên khai báo tường minh; với canonical constructor khai báo tường minh, Annotation trên formal parameter có thể khác Annotation trên record component. Vì vậy không nên giả định “đặt một lần thì tự xuất hiện ở mọi nơi”.

### Chuyển sang Meta-Annotation

`@Target` và `@Retention` có một điểm thú vị: chúng cũng chính là annotation, nhưng được dùng để **cấu hình annotation type khác**. Những annotation như vậy được gọi là meta-annotations.
