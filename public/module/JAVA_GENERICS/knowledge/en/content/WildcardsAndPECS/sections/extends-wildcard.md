```java
static double sum(List<? extends Number> values) {
    double total = 0;
    for (Number value : values) {
        total += value.doubleValue();
    }
    return total;
}
```

The method can accept:

```java
List<Integer>
List<Double>
List<BigDecimal>
```

The element type is **some unknown subtype of `Number`**, so reading as `Number` is safe.

But these writes are not safe:

```java
// values.add(1);   // compile error
// values.add(2.5); // compile error
```

The actual list could be a `List<Double>`, so inserting an `Integer` would violate its element type.
