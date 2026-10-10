An implementation name becomes meaningful only after the required data characteristics are clear. Useful dimensions include:

| Characteristic | Question to ask |
| --- | --- |
| Encounter order | Does iteration order matter, and is it guaranteed? |
| Positional access | Do callers need index-based access? |
| Duplicates | May two equal values coexist? |
| Key lookup | Must a value be found through a separate key? |
| Sorted order | Must the structure remain ordered by natural order or a `Comparator`? |
| Null policy | Does the chosen implementation accept `null`? |
| Mutability | May the structure be added to, removed from, or replaced after creation? |
| Operation cost | Is the workload dominated by index access, lookup, end insertion/removal, or maintaining order? |

Do not infer null or mutability policy from an interface alone. For example, `HashMap` allows one null key, while `Map.of(...)` rejects null keys and values. `ArrayList` is resizable, while `List.of(...)` is unmodifiable.

The same domain data can therefore appear in different structures:

```java
List<Long> processingOrder = new ArrayList<>();     // order; duplicates may be valid
Set<Long> uniqueUsers = new HashSet<>();            // uniqueness
Map<Long, Order> orderById = new HashMap<>();       // lookup by id
Deque<Order> pending = new ArrayDeque<>();           // operations at both ends
```

The next chapters examine each contract in turn. Whenever an implementation appears, come back to the same question: **which requirement in the problem makes this structure appropriate?**
