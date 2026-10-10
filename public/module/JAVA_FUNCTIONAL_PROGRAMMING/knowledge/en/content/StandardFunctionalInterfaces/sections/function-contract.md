`Function<T, R>` represents a transformation from one input value of type `T` to one result of type `R`.

Its functional method is:

```java
R apply(T value);
```

Example:

```java
Function<String, Integer> length = text -> text.length();

int result = length.apply("Java"); // 4
```

Use `Function` when the essential contract is **input → output**. The output may have the same type as the input, but when that relationship is guaranteed, `UnaryOperator<T>` communicates the intent more precisely.

`Function` is also used heavily in composition because its output can become another function's input. The composition rules themselves are covered in the later behavior-composition chapter.
