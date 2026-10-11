Tiếp tục ví dụ trên:

```java
Object pluginFromA =
        typeA.getDeclaredConstructor().newInstance();

Object casted = typeB.cast(pluginFromA);
```

`typeB.cast(...)` sẽ ném `ClassCastException` vì object được tạo từ `typeA`, không phải `typeB`.

Ta có:

```text
pluginFromA.getClass()
→ PaymentPlugin defined by loaderA

target typeB
→ PaymentPlugin defined by loaderB

binary name giống
defining loader khác
→ incompatible
```

Đây là kiểu lỗi hay xuất hiện trong:

- hệ thống plugin;
- application server redeploy;
- môi trường hot-reload/devtools;
- container/module có namespace tách biệt;
- test runner có ranh giới loading riêng.

Khi debug một `ClassCastException` “vô lý”, đừng chỉ in `getName()`. Hãy in cả loader:

```java
static void describe(Class<?> type) {
    System.out.printf(
            "%s -> %s%n",
            type.getName(),
            type.getClassLoader()
    );
}
```

Trong Java 9+, `Class#getModule()` cũng có thể giúp hiểu thêm ranh giới module, nhưng class loader identity vẫn là phần cốt lõi của type identity đang học ở đây.
