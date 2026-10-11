`RUNTIME` giữ Annotation trong class file và JVM giữ siêu dữ liệu để Reflection chuẩn ở thời gian chạy có thể đọc:

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Audit {
    String action();
    int level() default 1;
}
```

Ví dụ:

```java
Method method = PaymentService.class.getDeclaredMethod("transfer");
Audit audit = method.getAnnotation(Audit.class);

if (audit != null) {
    System.out.println(audit.action());
}
```

Đây là chính sách phù hợp khi framework hoặc mã ứng dụng ở thời gian chạy cần đọc siêu dữ liệu.

Nhưng:

> `RUNTIME` chỉ làm siêu dữ liệu **có thể được đọc ở thời gian chạy**; nó không tự kích hoạt interception, validation hay dependency injection.

Một thành phần đọc vẫn phải chủ động đọc và xử lý siêu dữ liệu.

Với Annotation trên **type use**, việc kiểm tra ở thời gian chạy thường đi qua các API thuộc họ `AnnotatedType` thay vì chỉ các API Annotation trên khai báo quen thuộc của `AnnotatedElement`.
