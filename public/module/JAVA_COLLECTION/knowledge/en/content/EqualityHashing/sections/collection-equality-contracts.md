Element equality is the raw material, but each abstraction defines **whole-container equality** according to its own semantics:

| Abstraction | Two containers are equal when... |
| --- | --- |
| `List` | they have the same size and equal elements at each corresponding position |
| `Set` | they have the same size and the same members; encounter order does not matter |
| `Map` | they contain the same `key → value` mappings; encounter order does not matter |

```java
List<Integer> listA = List.of(1, 2);
List<Integer> listB = List.of(2, 1);
System.out.println(listA.equals(listB)); // false

Set<Integer> setA = new HashSet<>(List.of(1, 2));
Set<Integer> setB = new LinkedHashSet<>(List.of(2, 1));
System.out.println(setA.equals(setB));   // true
```

This is why choosing `List` versus `Set` is not only a performance choice. The abstraction also defines **what the container's logical value means**. The complete object-level laws of `equals/hashCode` remain in the Object Contract module.
