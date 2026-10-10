Only the **sign** of the result matters:

```text
< 0  → this comes before other
  0  → same position in the ordering
> 0  → this comes after other
```

Callers should not depend on exact values such as `-1`, `0`, or `1`.

### SIGN ANTISYMMETRY

If:

```text
sign(a.compareTo(b)) < 0
```

then the reverse comparison must have the opposite sign:

```text
sign(b.compareTo(a)) > 0
```

### TRANSITIVITY

If:

```text
a < b
b < c
```

the ordering must also preserve:

```text
a < c
```

Without transitivity, sorting algorithms and tree-based structures do not have one coherent order to work with.

### ORDERING CONSISTENCY

If ordering-relevant state is unchanged, comparison should not vary randomly with time or external state.

The contract also has a subtler requirement: if `a.compareTo(b) == 0`, then `a` and `b` must have the same ordering relationship to a third value `c`.

```text
a.compareTo(b) == 0
        ↓
sign(a.compareTo(c))
must match
sign(b.compareTo(c))
```

Otherwise two values declared equivalent in the ordering would behave differently against a third value, so the ordering would not be coherent.

### DO NOT COMPARE BY SUBTRACTION

Avoid:

```java
return this.id - other.id;
```

because integer overflow can reverse the sign.

```java
int a = Integer.MAX_VALUE;
int b = -1;

int result = a - b; // overflow
```

Prefer:

```java
Integer.compare(this.id, other.id)
Long.compare(this.id, other.id)
```

or comparator helpers that express the intent safely.

### `compareTo(null)`

The `Comparable` contract requires `x.compareTo(null)` to throw `NullPointerException` even though `x.equals(null)` returns `false`. Natural ordering does not use `null` as a valid peer value. A policy such as “nulls first” or “nulls last” belongs more naturally to `Comparator.nullsFirst` or `Comparator.nullsLast`.
