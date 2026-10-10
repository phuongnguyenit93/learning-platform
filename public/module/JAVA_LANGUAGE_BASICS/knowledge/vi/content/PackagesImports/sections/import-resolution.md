```java
import java.util.List;
```

không “nạp” lớp vào JVM. `import` chỉ giúp trình biên dịch phân giải tên đơn giản `List` đang nói tới kiểu nào.

Nếu hai kiểu có cùng tên đơn giản gây mơ hồ, có thể dùng tên đầy đủ cho ít nhất một bên.

`java.lang` được import ngầm; kiểu nằm trong cùng `package` cũng không cần `import` tường minh.

### Wildcard không import `subpackage`

```java
import java.util.*;
```

cho phép dùng tên đơn giản của các kiểu trực tiếp trong `java.util`, nhưng **không** tự import kiểu từ `java.util.concurrent`.

Wildcard import không làm JVM nạp nhiều lớp hơn; nó chỉ ảnh hưởng việc phân giải tên trong mã nguồn.

Tên `package` trông giống cây thư mục nhưng **subpackage không kế thừa quyền truy cập của package cha**:

```text
com.example
com.example.internal
```

được Java xem là hai `package` khác nhau về quyền truy cập. Một thành viên `package-private` trong `com.example` không tự truy cập được từ `com.example.internal` chỉ vì tên bắt đầu giống nhau.

### Tên đơn giản bị mơ hồ

```java
import java.util.Date;
// import java.sql.Date; // sẽ conflict simple name Date

java.sql.Date sqlDate = java.sql.Date.valueOf("2026-09-26");
Date utilDate = new Date();
```

Java không có cú pháp alias cho `import` như một số ngôn ngữ khác. Khi tên đơn giản xung đột, hãy dùng tên đầy đủ ở vị trí phù hợp.
