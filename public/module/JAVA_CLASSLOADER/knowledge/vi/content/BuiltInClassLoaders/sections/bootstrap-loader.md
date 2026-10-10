Bootstrap loader chịu trách nhiệm cho các class nền tảng cốt lõi mà JVM/JDK runtime cần, ví dụ nhiều class trong `java.base`.

```java
public class BootstrapDemo {
    public static void main(String[] args) {
        System.out.println(String.class.getClassLoader());
        System.out.println(Object.class.getClassLoader());
    }
}
```

Trong JVM thông thường, kết quả là:

```text
null
null
```

`null` ở đây **không có nghĩa class không có loader**. Java API dùng `null` để biểu diễn rằng class được bootstrap loader định nghĩa, vì bootstrap loader không được công khai như một object `java.lang.ClassLoader` bình thường.

Cách hiểu:

```text
String.class.getClassLoader() == null
→ bootstrap-defined class
→ không phải “không ai load String”
```

Trong Java hiện đại, không nên hiểu các core runtime class như thể chúng chỉ đến từ một `rt.jar` kiểu Java 8. JDK 9+ dùng module runtime image; cách lưu trữ có thể khác, nhưng vai trò bootstrap loading vẫn còn.
