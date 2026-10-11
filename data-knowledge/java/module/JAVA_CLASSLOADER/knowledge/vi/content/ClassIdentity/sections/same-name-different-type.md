Giả sử ta có bytes của:

```java
package com.example.plugins;

public final class PaymentPlugin {
}
```

Hai loader tách biệt cùng định nghĩa bytes đó:

```java
ClassLoader loaderA = new InMemoryPluginClassLoader(
        parent,
        Map.of("com.example.plugins.PaymentPlugin", bytes)
);

ClassLoader loaderB = new InMemoryPluginClassLoader(
        parent,
        Map.of("com.example.plugins.PaymentPlugin", bytes)
);

Class<?> typeA =
        loaderA.loadClass("com.example.plugins.PaymentPlugin");

Class<?> typeB =
        loaderB.loadClass("com.example.plugins.PaymentPlugin");

System.out.println(typeA.getName().equals(typeB.getName())); // true
System.out.println(typeA == typeB);                         // false
System.out.println(typeA.getClassLoader() == typeB.getClassLoader()); // false
```

Kết quả quan sát:

```text
cùng binary name
cùng byte content
khác defining loader
→ khác Class identity tại runtime
```

Đây chính là cơ chế cho phép hai plugin cùng mang một library version khác nhau mà không nhất thiết trộn toàn bộ static state/type identity với nhau.

Sự tách biệt vì vậy không chỉ là “file nằm ở thư mục khác”. Nó là **namespace khác tại runtime**.
