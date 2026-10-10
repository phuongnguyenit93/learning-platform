The `Bi...` interfaces model common contracts with two input values.

```java
BiFunction<BigDecimal, Integer, BigDecimal> multiply =
        (price, quantity) -> price.multiply(BigDecimal.valueOf(quantity));

BiPredicate<String, Integer> minimumLength =
        (text, minimum) -> text.length() >= minimum;

BiConsumer<Map<String, Integer>, String> increment =
        (counts, key) -> counts.merge(key, 1, Integer::sum);
```

Their shapes are:

- `BiFunction<T, U, R>`: two inputs, one result;
- `BiPredicate<T, U>`: two inputs, `boolean` result;
- `BiConsumer<T, U>`: two inputs, no result.

There is no standard `TriFunction` family in `java.util.function`. If a behavior naturally requires more parameters, consider whether a small domain object would make the contract clearer before creating a custom multi-argument interface.
