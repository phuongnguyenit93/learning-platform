`Collections` is a **utility class**, not the `Collection<E>` interface. It provides static algorithms that operate on existing collections/lists. There is no need to memorize the full API; a representative set shows the purpose of this layer:

```java
List<Integer> values = new ArrayList<>(List.of(30, 10, 20));

Collections.sort(values);          // [10, 20, 30]
Collections.reverse(values);       // [30, 20, 10]
Collections.shuffle(values);       // randomizes order

int min = Collections.min(values);
int max = Collections.max(values);
```

In modern code, `list.sort(comparator)` is often more direct than `Collections.sort(list, comparator)`, but both illustrate the same idea: **an algorithm can be separated from the concrete list implementation**.

`binarySearch` has an important precondition: the list must already be sorted using the **same ordering** used by the search.

```java
List<Integer> sorted = new ArrayList<>(List.of(10, 20, 30, 40));
int index = Collections.binarySearch(sorted, 30); // 2
```

If the list is not sorted, or the search ordering differs from the sort ordering, the result is not meaningful. When no match is found, the method returns a negative value encoding the insertion point; callers should not treat every negative result as simply “index -1”.

Utilities such as `reverse`, `shuffle`, and `sort` mutate the list when mutation is supported. Passing an unmodifiable list such as `List.of(...)` to a mutating utility can produce `UnsupportedOperationException`. Always consider **both the algorithm contract and the input collection's mutability contract**.
