A **structural modification** changes the structure being traversed. The exact definition is implementation-specific, but in common collections it usually includes adding or removing elements/mappings.

For `ArrayList`:

```java
List<String> users = new ArrayList<>(List.of("U01", "U02", "U03", "U04"));

users.add("U04");    // structural: size changes
users.remove("U01"); // structural: size changes
users.set(0, "U10"); // not structural for ArrayList
```

For a `Map`, adding/removing a mapping is generally structural, while replacing the value for an existing key generally does not change the key structure. Application code should not depend on internal fields such as a particular implementation's `modCount`; the collection/iterator contract is the reliable boundary.

One useful exception to the simple rule is an access-order `LinkedHashMap`: an access such as `get` can move an entry in encounter order, and that reordering can count as a structural modification for its fail-fast iterators. “Structural” must therefore be read from the concrete collection's contract, not reduced to “size changed.”
