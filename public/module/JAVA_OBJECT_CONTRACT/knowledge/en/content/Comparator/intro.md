# Alternate Ordering with Comparator

`Comparable` places one natural order inside a type. `Comparator<T>` moves ordering policy **outside the type**, allowing the same data to be viewed through many orderings without changing the domain class.

This is an important design distinction:

```text
Comparable
→ the type owns one natural order

Comparator
→ the caller/context owns an ordering policy
```
