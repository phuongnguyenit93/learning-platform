`asType` creates an adapter with another `MethodType` when the required conversions are supported.

```java
MethodHandle typed = ...; // (String)String

MethodHandle generic =
        typed.asType(
                MethodType.methodType(
                        Object.class,
                        Object.class
                )
        );
```

Calling `generic` converts/casts the incoming `Object` to the String expected by the target and exposes the String result as Object.

`explicitCastArguments` has different conversion rules and is appropriate when explicit casting/numeric conversion semantics are intended.

```text
current target type
        ↓
desired call contract
        ↓
legal adapter?
        ↓
new handle with an exact new type
```
