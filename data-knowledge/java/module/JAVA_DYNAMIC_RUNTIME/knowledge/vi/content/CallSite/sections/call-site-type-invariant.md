Type của một CallSite được xác định khi tạo và không thay đổi:

```java
MethodType type = site.type();
```

Nếu target hiện tại là:

```text
(String)String
```

thì mọi target thay thế sau này cũng phải có **exactly cùng MethodType**.

```java
MutableCallSite site =
        new MutableCallSite(
                MethodType.methodType(
                        String.class,
                        String.class
                )
        );

site.setTarget(targetWithSameType);
```

Target sai type sẽ gây `WrongMethodTypeException`.

Mental model:

```text
CallSite identity
        +
permanent MethodType
        ↓
target có thể cố định hoặc thay đổi
        nhưng
target.type() luôn phải == site.type()
```
