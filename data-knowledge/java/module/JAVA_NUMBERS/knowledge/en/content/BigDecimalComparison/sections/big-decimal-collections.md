### HashSet

```java
Set<BigDecimal> values = new HashSet<>();
values.add(new BigDecimal("1.0"));
values.add(new BigDecimal("1.00"));

System.out.println(values.size()); // 2
```

`HashSet` uses `equals/hashCode`.

### TreeSet

```java
Set<BigDecimal> values = new TreeSet<>();
values.add(new BigDecimal("1.0"));
values.add(new BigDecimal("1.00"));

System.out.println(values.size()); // 1
```

`TreeSet` uses natural ordering through `compareTo` by default.

This creates an unusual situation where two collection families can treat the same pair of values differently.

### Normalization is not a universal fix

`stripTrailingZeros()` can canonicalize some values:

```java
BigDecimal normalized =
        new BigDecimal("1.00").stripTrailingZeros();
```

but normalization is itself a policy. It may change the scale, including to a negative scale for some values.

If BigDecimal is a domain key, decide explicitly whether identity is based on **representation** or **numerical quantity**.

The next chapter returns to standard numeric helpers in `Math`.
