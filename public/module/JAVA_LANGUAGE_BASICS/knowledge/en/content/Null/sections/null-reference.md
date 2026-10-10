Reference variables may hold `null` where the type/context allows it:

```java
String name = null;
```

Primitive variables cannot hold `null`. Reference types can; the wrapper/unboxing consequence is covered in the next chapter.

`null` is different from empty/default domain values:

```text
null        → no object is identified
""          → an existing empty String value/object
0           → a valid primitive int value
```

Using one null state to mean "not found," "not loaded," "not applicable," and "invalid" at the same time makes an API contract hard to reason about.
