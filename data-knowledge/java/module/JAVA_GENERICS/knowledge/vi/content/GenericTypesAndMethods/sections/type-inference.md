Thông thường bên gọi không cần viết type argument cho phương thức:

```java
String name = echo("java");
Integer number = echo(100);
```

Compiler suy luận `T` từ:

- kiểu của đối số;
- kiểu đích ở ngữ cảnh gán hoặc trả về;
- các ràng buộc khác trong lời gọi.

Có thể chỉ định **type witness** tường minh khi cần:

```java
String value = Util.<String>echo("java");
```

Nhưng nếu suy luận kiểu đã rõ, cách viết này thường dư thừa.

Suy luận kiểu không phải “đoán kiểu lúc chạy”. Compiler phải tìm được một kiểu thỏa mọi ràng buộc trước khi sinh bytecode.
