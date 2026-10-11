Type erasure không có nghĩa **mọi dấu vết của Generics đều biến mất khỏi class file**.

Ví dụ một field được khai báo:

```java
List<String> names;
```

bytecode thực thi chủ yếu làm việc với kiểu đã xóa `List`, nhưng class file có thể đồng thời giữ chữ ký generic mô tả `List<String>` để compiler, Reflection và các công cụ khác đọc lại.

Vì vậy cần tách hai lớp thông tin:

```text
kiểu dùng cho thực thi lúc chạy
→ chủ yếu là kiểu sau erasure

generic signature metadata
→ siêu dữ liệu mô tả type parameter / type argument của khai báo
→ có thể còn được lưu trong class file
```

Reflection có các kiểu biểu diễn như `ParameterizedType`, `TypeVariable` và `WildcardType` để đọc metadata này. Cơ chế Reflection cụ thể thuộc module Reflection; ở đây chỉ cần giữ mô hình tư duy rằng **phần thực thi đã bị erasure và metadata generic còn lưu lại có thể cùng tồn tại**.
