The type parameters in standard functional interfaces make the direction of data explicit.

For `Function<T, R>`:

```text
T  ──apply──>  R
```

For `BiFunction<T, U, R>`:

```text
T + U  ──apply──>  R
```

For `Predicate<T>`, `T` is the input and `boolean` is fixed as the result. For `Consumer<T>`, `T` is the input and there is no result. For `Supplier<T>`, there is no input parameter and `T` is the produced result.

This relationship matters when reading generic APIs:

```java
Function<Order, BigDecimal> total = Order::total;
```

The type tells the reader the complete high-level flow before inspecting the lambda body: an `Order` goes in and a `BigDecimal` comes out.

Later composition becomes easier to reason about when the output type of one behavior matches the input type expected by the next.
