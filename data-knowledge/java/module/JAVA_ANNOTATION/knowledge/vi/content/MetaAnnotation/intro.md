# Meta-Annotation và cách cấu hình kiểu Annotation

Sau khi tự tạo `@Audit`, Java vẫn cần biết thêm:

```text
@Audit được phép đặt ở đâu?
→ method, class, field...?

@Audit phải tồn tại đến lúc nào?
→ mã nguồn, class file hay thời gian chạy?

Nó có xuất hiện trong tài liệu không?
Nó có tham gia tra cứu qua superclass không?
Nó có được phép lặp lại không?
```

Nếu các quy tắc này chỉ nằm trong chú thích mã nguồn thì trình biên dịch/công cụ không có cấu trúc chuẩn để kiểm tra. Vì vậy **chính kiểu Annotation cũng cần siêu dữ liệu mô tả nó**.

Meta-Annotation là **Annotation dùng để mô tả hoặc cấu hình một annotation interface khác**.

Ví dụ:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
public @interface Audit {
    String action();
    int level() default 1;
}
```

Ở đây `@Retention`, `@Target` và `@Documented` không mô tả method nghiệp vụ; chúng mô tả chính quy tắc của `@Audit`.
