Ví dụ:

```java
String a = new String("java");
String b = a.intern();
String c = "java";

System.out.println(b == c); // true
```

Sau `intern()`, `b` dùng tham chiếu chuẩn trong pool cho nội dung `"java"`.

Nhưng logic nghiệp vụ vẫn nên dùng `equals` khi câu hỏi là **nội dung có bằng nhau không**. Không nên chuyển mọi phép so sánh sang định danh tham chiếu chỉ vì có `intern()`.

`intern()` nối trực tiếp với cơ chế literal trong String Pool:

```java
String runtime = new String("java");
String canonical = runtime.intern();
String literal = "java";

System.out.println(canonical == literal); // true
```

Đây là thí nghiệm hợp lệ về định danh tham chiếu vì chuẩn hóa chính là khái niệm đang được quan sát.
