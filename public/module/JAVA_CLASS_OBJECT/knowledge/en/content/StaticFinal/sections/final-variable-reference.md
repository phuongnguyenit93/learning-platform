A `final` variable may receive a value only once under Java's definite-assignment rules. It can be initialized at the declaration or assigned later exactly once along every valid initialization path.

```java
final int x = 10;
final List<String> names = new ArrayList<>();
```

For a reference, `final` prevents `names` from pointing to a different list, but it does **not** make the list immutable.

The keyword also has declaration-specific meanings that later connect to inheritance:

```text
final variable
→ reference/value cannot be reassigned after its one assignment

final method
→ subclasses cannot override that method

final class
→ cannot be subclassed
```

This chapter only needs that boundary; overriding and inheritance design belong to the OOP module.
