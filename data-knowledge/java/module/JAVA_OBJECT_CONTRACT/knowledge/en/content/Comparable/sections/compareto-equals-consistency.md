When a natural ordering is **consistent with `equals`**, these two boolean expressions agree:

```text
(compareTo(other) == 0)
        ↕ equivalent
equals(other)
```

Java strongly recommends this consistency, although `Comparable` itself does not require `compareTo(...) == 0` to imply `equals(...) == true`. The reason is operational, not merely stylistic: sorted collections use comparison to identify ordering keys, while the general `Set`/`Map` contracts are defined in terms of `equals`.

### HASH-BASED AND TREE-BASED COLLECTIONS INTERPRET “SAME” DIFFERENTLY

Mental model:

```text
HashSet / HashMap
→ equals + hashCode

TreeSet / TreeMap
→ compareTo or Comparator
```

If:

```text
a.equals(b) == false
a.compareTo(b) == 0
```

a `HashSet` may keep both values while a `TreeSet` may treat them as one ordering key.

The reverse mismatch is surprising too:

```text
a.equals(b) == true
a.compareTo(b) != 0
```

then a sorted set may retain both values even though logical equality says they are equal, causing sorted-collection behavior to diverge from normal `Set` expectations.

`BigDecimal` is a well-known example:

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("1.00");

System.out.println(a.equals(b));     // false
System.out.println(a.compareTo(b));  // 0
```

That type-level ordering is allowed, but callers must understand the consequence when choosing a collection.

If a class intentionally defines a natural ordering that is inconsistent with `equals`, document it clearly. `TreeSet`/`TreeMap` behavior is still well-defined because they use ordering to identify keys, but the collection may no longer satisfy the general `Set`/`Map` contract whose notion of equality is expressed through `equals`.

### MUTABLE ORDERING STATE

Like a mutable hash key, changing fields that participate in ordering while an object is stored in `TreeSet`/`TreeMap` can make the tree placement inconsistent with the object's new state.

Prefer stable ordering-relevant state for objects used as sorted keys.

When a type needs multiple orderings, `Comparator` is the better tool.
