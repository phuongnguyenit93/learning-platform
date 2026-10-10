`BigDecimal.equals` considers both numerical value **and scale**:

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("1.00");

System.out.println(a.equals(b)); // false
```

Their internal representations differ:

```text
a → unscaled 10,  scale 1
b → unscaled 100, scale 2
```

The mathematical quantity is the same, but the representation is not.

### WHY does equals behave this way?

Scale is part of the BigDecimal representation, and `equals/hashCode` preserve that distinction. Therefore the hash code for `1.0` does not have to match the hash code for `1.00`.
