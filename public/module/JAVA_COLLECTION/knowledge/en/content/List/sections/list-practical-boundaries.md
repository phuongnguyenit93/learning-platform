### `remove(index)` vs `remove(value)`

`List` overloads `remove`, which is easy to misread for numeric element types:

```java
List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30));

numbers.remove(1);                    // removes index 1 -> 20
numbers.remove(Integer.valueOf(10));  // removes value 10
```

A primitive `int` argument selects `remove(int index)`. To remove an `Integer` value, pass an `Integer` object explicitly.

### `subList` is a view, not a copy

```java
List<String> source = new ArrayList<>(List.of("A", "B", "C", "D"));
List<String> middle = source.subList(1, 3); // [B, C]

middle.set(0, "X");
System.out.println(source); // [A, X, C, D]
```

`subList(from, to)` returns a **backed view** of a range in the original list. Supported mutation through the view is reflected in the source and vice versa. If the backing list is structurally modified in any way other than through the returned sub-list, the semantics of that sub-list become undefined. A particular implementation may detect the mismatch and throw `ConcurrentModificationException`, but CME is not the `subList` contract itself.

Create an explicit copy when independence is required:

```java
List<String> snapshot = new ArrayList<>(source.subList(1, 3));
```

### `Arrays.asList` is neither a normal `ArrayList` nor `List.of`

```java
Order[] array = {orderA, orderB};

List<Order> fixedSize = Arrays.asList(array);
fixedSize.set(0, orderC);  // valid; array[0] changes too

// fixedSize.add(orderD);    // UnsupportedOperationException
// fixedSize.remove(orderB); // UnsupportedOperationException

List<Order> mutableCopy = new ArrayList<>(fixedSize);
List<Order> unmodifiableCopy = List.copyOf(fixedSize);
```

`Arrays.asList(array)` creates a **fixed-size list backed by the array**: `set` is supported, while size-changing `add/remove` operations are not. `List.of(...)`/`List.copyOf(...)` produce unmodifiable lists, while `new ArrayList<>(...)` creates a structurally independent mutable list.
