`@Repeatable` cấu hình một kiểu Annotation để cùng Annotation đó có thể xuất hiện nhiều lần tại một vị trí hợp lệ. Java yêu cầu chỉ rõ **Annotation chứa** dùng để biểu diễn tập giá trị lặp:

```java
@Repeatable(Audits.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audit {
    String action();
    int level() default 1;
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audits {
    Audit[] value();
}
```

Sau đó người dùng có thể viết:

```java
@Audit(action = "SECURITY")
@Audit(action = "COMPLIANCE")
void transfer() {
}
```

Ở chương này chỉ cần giữ mô hình tư duy: `@Repeatable` cấu hình **mối quan hệ giữa Annotation lặp lại và Annotation chứa**. Các ràng buộc tương thích của Annotation chứa, cách Java biểu diễn nhiều giá trị và sự khác nhau giữa API tra cứu một Annotation với API `...AnnotationsByType(...)` thuộc chương tiếp theo.
