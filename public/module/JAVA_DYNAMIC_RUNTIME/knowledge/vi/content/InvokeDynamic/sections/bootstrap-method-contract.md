Bootstrap method là method được JVM gọi để link một dynamic call site. Một shape phổ biến:

```java
static CallSite bootstrap(
        MethodHandles.Lookup lookup,
        String name,
        MethodType type
) throws Throwable
```

Bootstrap có thể nhận thêm static arguments từ constant pool.

Nhiệm vụ chính:

1. đọc context (`Lookup`, symbolic name, `MethodType`, static args);
2. chọn/tạo target `MethodHandle`;
3. adapt target về đúng call-site type nếu cần;
4. trả một `CallSite`.

```java
MethodHandle target = ...;
target = target.asType(type);
return new ConstantCallSite(target);
```

Bootstrap nên tập trung vào **linkage**, không chứa luồng nghiệp vụ cần chạy lại cho mỗi invocation.
