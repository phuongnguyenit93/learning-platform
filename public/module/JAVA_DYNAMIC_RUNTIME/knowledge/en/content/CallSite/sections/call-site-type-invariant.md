A CallSite's type is fixed when the site is created:

```java
MethodType type = site.type();
```

If the site type is:

```text
(String)String
```

every later replacement target must have **exactly the same MethodType**.

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

A mismatched target causes `WrongMethodTypeException`.

```text
CallSite identity
        +
permanent MethodType
        ↓
target may be fixed or mutable
        but
target.type() must remain == site.type()
```
