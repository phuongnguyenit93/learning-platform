`filterArguments` transforms inputs before the target runs:

```java
MethodHandle trim =
        lookup.findVirtual(
                String.class,
                "trim",
                MethodType.methodType(String.class)
        );

MethodHandle normalized =
        MethodHandles.filterArguments(
                boundGreet,
                0,
                trim
        );
```

```text
"  Phuong "
→ trim
→ "Phuong"
→ greet
→ "Hello Phuong"
```

`filterReturnValue` applies the same idea to output. Fold/combiner APIs can compute additional values from arguments before a target is invoked.

If a pipeline becomes harder to understand than a normal Java wrapper method, that is a design signal: a plain method may be the better abstraction.
