Generic functional interfaces use reference types, so primitive values used with types such as `Function<Integer, Integer>` may require boxing and unboxing.

`java.util.function` therefore includes primitive-specialized variants for common `int`, `long`, and `double` shapes, for example:

```java
IntPredicate positive = value -> value > 0;
IntUnaryOperator square = value -> value * value;
ToIntFunction<String> length = String::length;
IntFunction<String> label = value -> "#" + value;
```

These interfaces do not introduce a different programming model. They express the same behavior shapes while avoiding unnecessary wrapper objects in primitive-heavy code.

Do not select a primitive specialization automatically for every primitive occurrence. Prefer it when the API already expects that specialization or when avoiding boxing is relevant to the code path; otherwise, clarity remains the first concern.
