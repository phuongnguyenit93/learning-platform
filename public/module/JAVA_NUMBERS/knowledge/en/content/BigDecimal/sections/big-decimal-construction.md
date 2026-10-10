### From String

For an exact decimal literal or text value:

```java
BigDecimal rate = new BigDecimal("0.1");
```

### `valueOf(double)`

```java
BigDecimal value = BigDecimal.valueOf(0.1);
```

`valueOf(double)` uses the decimal string representation of the `double`. For a literal such as `0.1`, that commonly preserves the decimal intent a programmer expects.

### Pitfall: `new BigDecimal(double)`

```java
BigDecimal bad = new BigDecimal(0.1);
```

This constructor receives the actual binary floating-point value, so the BigDecimal can expose a long decimal approximation such as:

```text
0.10000000000000000555...
```

### BigDecimal cannot recover intent that was already lost

```java
double x = 0.1 + 0.2;
BigDecimal value = BigDecimal.valueOf(x);
```

The floating-point arithmetic has already happened:

```text
0.1 + 0.2
→ binary approximation
→ 0.30000000000000004
→ BigDecimal.valueOf(...)
```

BigDecimal cannot infer that the original desired decimal quantity was `0.3`.

If exact decimal semantics are the contract, keep the pipeline decimal from the beginning:

```java
BigDecimal result =
        new BigDecimal("0.1")
                .add(new BigDecimal("0.2"));
```
