Most lambda parameter types can be inferred from the target function type:

```java
BiFunction<Integer, Integer, Integer> add = (left, right) -> left + right;
```

They can also be written explicitly:

```java
BiFunction<Integer, Integer, Integer> add =
        (Integer left, Integer right) -> left + right;
```

Since Java 11, `var` may be used for lambda parameters when annotations or a uniform explicit style are useful:

```java
BiFunction<Integer, Integer, Integer> add =
        (var left, var right) -> left + right;
```

Within one lambda parameter list, use a consistent parameter-declaration style. Do not mix an implicitly typed parameter with an explicitly typed or `var` parameter.

Inference removes repetition; it does not make the parameters dynamically typed. Their compile-time types still come from the target functional interface.
