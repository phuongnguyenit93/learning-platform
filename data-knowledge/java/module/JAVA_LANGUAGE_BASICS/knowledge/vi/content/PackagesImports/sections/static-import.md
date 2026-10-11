`static import` cho phép dùng thành viên `static` mà không ghi tên kiểu phía trước:

```java
import static java.lang.Math.max;

int x = max(a, b);
```

Nó hữu ích khi tên thành viên rất rõ trong ngữ cảnh, nhưng quá nhiều `static import` có thể làm mất dấu thành viên đến từ kiểu nào.

`static import` có thể nhắm tới trường hoặc phương thức `static`:

```java
import static java.lang.Math.PI;
import static java.lang.Math.max;
```

Nó không biến thành viên thành khai báo cục bộ và không thay đổi quyền truy cập. Thành viên vẫn phải truy cập được theo quy tắc Java.
