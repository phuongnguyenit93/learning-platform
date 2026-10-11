The useful mental model for `ArrayList` is a **resizable array**. It has contiguous indexed storage plus a logical `size` indicating how many elements are in use.

Appending is cheap while spare capacity exists:

```text
capacity = 8
size     = 5

[A][B][C][D][E][ ][ ][ ]
                  ↑
              append here
```

When capacity is exhausted, the implementation allocates a larger array and copies elements into it. Because resizing happens only occasionally, appending with `add(E)` is **amortized O(1)** even though an individual resize is O(n).

Indexed access fits the array model well:

```java
Order order = orders.get(500);
```

`get(index)` is O(1) because the location can be calculated directly. Inserting or removing in the middle usually requires shifting later elements:

```text
before: [A][B][C][D]
insert X at index 1
after : [A][X][B][C][D]
              └────────→ shifted elements
```

Typical costs are therefore:

| Operation | `ArrayList` |
| --- | --- |
| `get(index)` | O(1) |
| `set(index, value)` | O(1) |
| append | amortized O(1) |
| middle insert/remove | O(n) because elements shift |
| search by value | O(n) for a linear scan |

Big-O describes growth in cost, not an absolute benchmark. Cache locality and object overhead also affect real performance. For workloads dominated by indexed reads and appends, `ArrayList` is usually a strong default `List` implementation.

`ArrayList` does not provide automatic synchronization for multi-threaded access. Concurrency ownership belongs to a separate curriculum area; choosing a collection does not by itself solve synchronization.
