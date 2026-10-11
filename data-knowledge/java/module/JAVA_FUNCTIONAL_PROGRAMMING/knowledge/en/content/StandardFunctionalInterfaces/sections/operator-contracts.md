The operator interfaces preserve a same-type relationship: `UnaryOperator<T>` specializes `Function<T, T>`, while `BinaryOperator<T>` specializes `BiFunction<T, T, T>`.

`UnaryOperator<T>` represents one input and one result of type `T`:

```java
UnaryOperator<String> normalize = text -> text.trim().toLowerCase();
```

`BinaryOperator<T>` represents two `T` inputs and one `T` result:

```java
BinaryOperator<Integer> max = (left, right) -> Math.max(left, right);
```

Use these interfaces when the same-type relationship is meaningful. `UnaryOperator<String>` communicates "String in, String out" more directly than `Function<String, String>`, while `BinaryOperator<Integer>` communicates that two values of one domain type are combined into another value of that same type.
