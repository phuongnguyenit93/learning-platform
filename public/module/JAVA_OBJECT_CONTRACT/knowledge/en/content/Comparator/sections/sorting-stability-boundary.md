A stable sort preserves the encounter order of elements that compare as equal.

For input:

```text
[A(priority=1), B(priority=1), C(priority=2)]
```

if sorting only compares `priority` and the algorithm/API guarantees stability, `A` remains before `B` because they tie under the comparator.

### KEEP TWO CONTRACTS SEPARATE

```text
sort stability
→ property of the sorting algorithm/API

comparator consistency
→ property of the ordering function
```

A good comparator does not automatically make a sort stable. A stable sorting algorithm also cannot repair a comparator that violates transitivity.

Do not assume every sorting API is stable unless its contract says so.

With both natural ordering and caller-defined ordering in place, the final chapter reconnects ordering with identity, equality, hashing, text representation, and mutable-state risks so the whole module can be used as one decision model.
