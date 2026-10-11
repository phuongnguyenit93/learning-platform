Một mô hình tư duy hữu ích:

```text
mã nguồn có T / List<String> / bounds
        ↓
compiler kiểm tra các ràng buộc generic
        ↓
type parameter như T được xóa về bound hoặc Object
parameterized type như List<String> được xóa về List
        ↓
compiler chèn phép ép kiểu khi cần
        ↓
bytecode làm việc với các kiểu runtime thông thường
```

Cần tách hai quy tắc:

```text
T
→ erasure là leftmost bound nếu có
→ nếu không có bound rõ ràng thì thường là Object

List<String>
→ type argument String bị xóa khỏi kiểu dùng cho thực thi
→ erasure của parameterized type là List
```

Vì vậy “erasure về `Object`” **không áp dụng cho mọi generic type**. Nó chủ yếu mô tả trường hợp type variable không có bound cụ thể; còn một parameterized type như `List<String>` được xóa về raw type tương ứng là `List`.

Ví dụ:

```java
class Box<T> {
    T value;
    T get() { return value; }
}
```

Ở mức khái niệm, khi `T` không có bound thì erasure gần với:

```java
class Box {
    Object value;
    Object get() { return value; }
}
```

Bên gọi dùng kiểu cụ thể:

```java
String s = box.get();
```

được compiler bảo vệ bằng kiểm tra generic và phép ép kiểu thích hợp trong bytecode.

Nếu `T extends Number`, erasure của `T` dựa trên leftmost bound `Number`, không phải luôn luôn `Object`.

Với nhiều bound, quy tắc vẫn dựa trên **bound đứng đầu**:

```java
<T extends Number & Comparable<T>>
```

thì erasure của `T` là `Number`. Đây chính là lý do chapter Bounded Type Parameters yêu cầu class bound, nếu có, phải đứng trước các interface bound.
