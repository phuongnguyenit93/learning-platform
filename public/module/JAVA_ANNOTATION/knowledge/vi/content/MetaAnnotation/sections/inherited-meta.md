`@Inherited` khai báo rằng một Annotation trên **class** có thể tham gia cơ chế tra cứu đi lên superclass ở thời gian chạy:

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

Điều `@Inherited` cấu hình ở đây chỉ là **khả năng tham gia tra cứu theo chuỗi kế thừa class**. Nó không biến Annotation thành siêu dữ liệu tự sao chép sang mọi subtype/member:

```text
class annotation + @Inherited
→ có thể được tra cứu qua superclass

method / field / constructor / parameter / interface
→ không nhận quy tắc kế thừa này chỉ vì có @Inherited
```

Muốn Reflection quan sát được kết quả ở thời gian chạy, Annotation vẫn phải có chính sách lưu giữ phù hợp, thường là `RUNTIME`. Chương tiếp theo sẽ đi sâu vào API tra cứu, cơ chế tìm ngược lên superclass và ranh giới method/interface.
