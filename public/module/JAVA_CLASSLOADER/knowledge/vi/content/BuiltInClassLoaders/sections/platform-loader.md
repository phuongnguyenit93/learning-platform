`ClassLoader.getPlatformClassLoader()` trả về platform ClassLoader.

Vai trò của nó là load các platform classes không thuộc tập bootstrap cốt lõi nhưng vẫn là một phần của runtime/platform modules.

```java
public class PlatformLoaderDemo {
    public static void main(String[] args) {
        ClassLoader platform = ClassLoader.getPlatformClassLoader();

        System.out.println(platform);
        System.out.println(platform.getParent());
    }
}
```

`platform.getParent()` thường trả `null`, tức parent logic của nó là bootstrap loader được API biểu diễn bằng `null`.

Một cách quan sát khác:

```java
System.out.println(java.sql.Driver.class.getClassLoader());
```

Trên JDK chuẩn, nhiều class thuộc platform modules như `java.sql` được platform loader định nghĩa. Không nên hard-code tên concrete implementation class của loader vào logic nghiệp vụ; API contract quan trọng hơn tên implementation nội bộ.
