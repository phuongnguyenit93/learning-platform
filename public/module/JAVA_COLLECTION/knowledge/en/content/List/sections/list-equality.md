The `List.equals` contract checks more than “contains the same elements.” Two lists are equal when:

1. the other object is also a `List`;
2. both lists have the same size;
3. each pair of elements at the **same position** is equal.

```java
List<Long> a = List.of(10L, 20L, 30L);
List<Long> b = List.of(10L, 20L, 30L);
List<Long> c = List.of(30L, 20L, 10L);

System.out.println(a.equals(b)); // true
System.out.println(a.equals(c)); // false
```

Encounter order is therefore part of a list's logical value. If the domain says order is irrelevant and uniqueness is what matters, `Set` may be the better abstraction.

The full `equals/hashCode` laws belong to the Object Contract module. The collection-specific point is that element equality affects operations such as `contains`, `indexOf`, and whole-list equality, while ordering gives `List` different semantics from `Set`.
