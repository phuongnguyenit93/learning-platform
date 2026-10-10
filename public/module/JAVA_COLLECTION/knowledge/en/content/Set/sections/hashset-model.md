`HashSet` is a natural choice when membership/uniqueness is the main requirement and no particular encounter order is required. A useful mental model is:

```text
element
  ↓ hashCode()
select candidate bucket/region
  ↓
equals() confirms equivalence
```

With a reasonable hash distribution, `add`, `contains`, and `remove` have expected near-O(1) cost. That is an expected complexity characteristic, not a guarantee that every individual call is constant time.

```java
Set<Long> processedOrderIds = new HashSet<>();

if (processedOrderIds.add(order.id())) {
    process(order);
}
```

Here, `add` both tests and records uniqueness, avoiding an unnecessary “`contains` then `add`” pattern in single-threaded code.

Exact bucket layout, resizing, and tree bins are implementation details and may evolve. The important contract boundary is:

1. an element must preserve stable equality/hash behavior while stored in the set;
2. hashing narrows the candidate search area;
3. `equals` confirms equality for a hash-based collection.

If an object changes a field used by `equals/hashCode` after insertion into a `HashSet`, lookup can become inconsistent from the caller's perspective because the object no longer matches the hash location where it was stored. The Equality/Hashing chapter owns the detailed invariant; the practical rule here is to avoid mutating fields that define logical identity while an element is stored in a hash set.

`HashSet` does not guarantee iteration order. Output that happens to look stable during a few runs is not an ordering contract.
