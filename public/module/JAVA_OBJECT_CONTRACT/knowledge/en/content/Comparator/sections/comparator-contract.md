A comparator must define a coherent ordering.

### SIGN ANTISYMMETRY

If:

```text
compare(a, b) < 0
```

then the reverse comparison must give:

```text
compare(b, a) > 0
```

More generally, swapping the arguments must reverse the sign. Otherwise the comparator could claim that `a` comes before `b` while also claiming that `b` comes before `a`.

### TRANSITIVITY

If a comparator says:

```text
a < b
b < c
```

it must preserve:

```text
a < c
```

A circular “rock-paper-scissors” comparator does not define a valid total ordering for sorting or tree structures.

### VALUES THAT COMPARE AS ZERO MUST BE ORDERING-CONSISTENT

If:

```text
compare(a, b) == 0
```

then for a third value `c`, the sign of:

```text
compare(a, c)
```

must agree with the sign of:

```text
compare(b, c)
```

This makes values that are equivalent under the ordering behave as one coherent ordering class.

### CONSISTENCY WITH EQUALITY

The ordering imposed by a `Comparator` is **consistent with `equals`** when:

```text
(compare(a, b) == 0)
        ↕ equivalent
a.equals(b)
```

A comparator is not strictly required to preserve this consistency, but callers must understand the consequences when it does not, especially in `TreeSet` and `TreeMap`. Those collections still have well-defined ordering-based behavior, yet they may no longer satisfy the general `Set`/`Map` contract if ordering equivalence disagrees with `equals`.

The same two mismatch directions introduced with `Comparable` still apply when ordering comes from a `Comparator`:

```text
a.equals(b) == false
compare(a, b) == 0

a.equals(b) == true
compare(a, b) != 0
```

The first can make a sorted collection treat two logically different values as one ordering key; the second can make it retain both values even though `equals` says they are equal. The comparator-specific difference is ownership: this ordering policy is supplied externally by the caller and may vary by context rather than being fixed as the type's natural order.

If an ordering is intentionally inconsistent with `equals`, document that fact clearly so callers do not confuse sorted-collection key semantics with the object's logical equality.

```java
Set<Book> books = new TreeSet<>(Comparator.comparing(Book::title));
```

Two different books with the same title may collapse to one ordering key in that `TreeSet`. That is not a `TreeSet` bug; the comparator told the collection that the values compare as equal.

### MUTABLE COMPARISON STATE

Using mutable fields in a comparator can break ordered-collection expectations if those fields change after insertion.

```text
insert with price = 10
        ↓
tree placement based on price 10
        ↓
mutate price = 1000
        ↓
object state no longer matches its old ordering position
```

The same risk exists when a comparator depends on mutable external configuration, current time, or other state that can change between comparisons. Prefer stable ordering-relevant state and a stable comparison policy while objects are stored in tree-based structures.
