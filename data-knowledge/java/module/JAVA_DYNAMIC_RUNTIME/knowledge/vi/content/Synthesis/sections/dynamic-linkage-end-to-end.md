End-to-end dynamic linkage:

```text
bên gọi
  ↓
invokedynamic descriptor
  ↓
bootstrap(
    Lookup,
    name,
    MethodType,
    static args
)
  ↓
resolve/create MethodHandle target
  ↓
adapt target to exact call-site type
  ↓
create CallSite
  ↓
JVM links instruction to CallSite
  ↓
invoke current target
```

Nếu CallSite là mutable:

```text
same linked CallSite
        ↓
target changes
        ↓
future invocations may observe new target
```

Đây là phần tổng hợp quan trọng nhất của nhánh invocation/linkage.
