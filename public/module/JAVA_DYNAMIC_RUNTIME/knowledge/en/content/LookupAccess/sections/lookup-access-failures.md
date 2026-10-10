Two major failure groups:

```text
symbolic member missing / descriptor wrong
→ NoSuchMethodException
→ NoSuchFieldException

member exists but Lookup lacks access
→ IllegalAccessException
```

For example:

```java
lookup.findVirtual(
        Greeter.class,
        "greet",
        MethodType.methodType(
                String.class,
                Object.class // wrong parameter type
        )
);
```

Lookup expects the member's exact symbolic signature. It does not search for the “nearest overload.”

When debugging access:

1. inspect lookup class and modes;
2. inspect declaring-class/member visibility;
3. inspect package/module readability and openness;
4. verify the exact `MethodType`;
5. only then reason about later handle adaptation.
