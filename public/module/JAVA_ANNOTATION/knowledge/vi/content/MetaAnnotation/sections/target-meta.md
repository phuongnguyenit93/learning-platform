`@Target` giới hạn ngữ cảnh mà Annotation được dùng:

```java
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface FeatureFlag {
}
```

Trình biên dịch kiểm tra quy tắc này:

```java
@FeatureFlag
class CheckoutService {

    @FeatureFlag
    void checkout() {
    }

    // @FeatureFlag
    // String state; // lỗi nếu FIELD không nằm trong @Target
}
```

`@Target` bản thân chỉ dùng trên khai báo annotation interface (`ANNOTATION_TYPE`).

Không khai báo `@Target` không tương đương với `@Target(ElementType.TYPE_USE)` hay “mọi vị trí cú pháp”. Vì vậy Annotation tùy chỉnh public nên thường khai báo `@Target` tường minh để quy tắc không mơ hồ.

### Meta-Annotation tùy chỉnh và giới hạn kết hợp

Không chỉ các Annotation chuẩn như `@Target` hay `@Retention` mới có thể gắn lên một kiểu Annotation. Ta cũng có thể tạo siêu dữ liệu dành riêng cho kiểu Annotation:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface FrameworkStereotype {
}

@FrameworkStereotype
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface AuditedComponent {
}
```

Ở đây `@FrameworkStereotype` mô tả chính kiểu Annotation `@AuditedComponent`.

Nhưng Java Core **không tự biến Meta-Annotation thành cơ chế kết hợp Annotation hay tra cứu bắc cầu**:

```java
@AuditedComponent
class PaymentService {
}
```

`PaymentService` không vì thế mà tự trở thành “được gắn trực tiếp `@FrameworkStereotype`”. Nếu một framework muốn hỗ trợ Annotation kết hợp, stereotype hoặc tra cứu Meta-Annotation đệ quy thì framework đó phải tự định nghĩa và triển khai ngữ nghĩa.

Mô hình tư duy:

```text
Meta-Annotation của Java Core
→ siêu dữ liệu được gắn lên kiểu Annotation

cơ chế kết hợp của framework
→ framework chủ động duyệt/diễn giải các Meta-Annotation
→ không phải hành vi mặc định của Java
```
