`@Target` nhận một hoặc nhiều giá trị từ enum `ElementType`:

```java
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface FeatureFlag {
    String value();
}
```

Trong Java 21, các giá trị `ElementType` chính gồm:

| `ElementType` | Ngữ cảnh điển hình |
| --- | --- |
| `TYPE` | class, interface, enum, record, annotation interface |
| `FIELD` | field, enum constant |
| `METHOD` | method |
| `PARAMETER` | formal parameter |
| `CONSTRUCTOR` | constructor |
| `LOCAL_VARIABLE` | biến cục bộ |
| `ANNOTATION_TYPE` | khai báo annotation interface |
| `PACKAGE` | khai báo package |
| `MODULE` | khai báo module |
| `TYPE_PARAMETER` | khai báo type parameter như `<T>` |
| `TYPE_USE` | vị trí một type được sử dụng |
| `RECORD_COMPONENT` | record component |

Ví dụ:

```java
@Target(ElementType.METHOD)
public @interface Audit {
    String action();
    int level() default 1;
}

class PaymentService {
    @Audit(action = "PAYMENT")
    void pay() {
    }

    // @Audit
    // String status; // lỗi khi biên dịch
}
```

### `PACKAGE` và `MODULE` nằm ở đâu trong mã nguồn?

Hai loại vị trí này dễ gây khó hiểu vì Annotation không được đặt trong một class thông thường.

Package annotation thường nằm trong `package-info.java`:

```java
@InternalPackage
package com.example.payment;
```

Module annotation nằm trong `module-info.java`:

```java
@InternalModule
module com.example.payment {
    exports com.example.payment.api;
}
```

Chúng vẫn tuân theo cùng mô hình tư duy: Annotation đang mô tả **khai báo package** hoặc **khai báo module**, và chỉ có ý nghĩa khi có thành phần đọc hiểu siêu dữ liệu đó.

### Khi không khai báo `@Target`

Không có `@Target` **không có nghĩa là “mọi vị trí kể cả TYPE_USE”**. Theo Java 21, Annotation đó áp dụng cho **tất cả ngữ cảnh khai báo**, bao gồm cả type parameter và record component, nhưng **không áp dụng cho ngữ cảnh sử dụng type**. Muốn gắn Annotation lên một lần sử dụng type thì phải cho phép `TYPE_USE`.

Nếu Annotation chỉ là kiểu phụ trợ bên trong một Annotation khác và không muốn được dùng trực tiếp, có thể viết:

```java
@Target({})
public @interface InternalMember {
    String value();
}
```

`@Target({})` làm Annotation không có vị trí gắn trực tiếp hợp lệ.
