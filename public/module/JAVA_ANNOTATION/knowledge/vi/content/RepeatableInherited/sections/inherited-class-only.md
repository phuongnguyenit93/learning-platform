Ví dụ:

```java
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface AuditedType {
}

@AuditedType
class BaseService {
}

class PaymentService extends BaseService {
}
```

Tra cứu:

```java
AuditedType annotation =
    PaymentService.class.getAnnotation(AuditedType.class);
```

có thể tìm annotation từ `BaseService`.

Nhưng:

```java
@AuditedType
interface AuditedContract {
}

class PaymentService implements AuditedContract {
}
```

`@Inherited` **không** làm `PaymentService` nhận annotation từ interface.

Quy tắc cần ghi nhớ:

```text
@Inherited
→ chuỗi superclass của khai báo class
→ không phải đồ thị interface
```
