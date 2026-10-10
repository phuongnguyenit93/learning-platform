These ideas are often collapsed into “a list that cannot be changed,” but their behavior is different:

| Shape | Example | Sees later source changes? | Can this reference change size? |
| --- | --- | --- | --- |
| backed mutable view | `list.subList(...)`, `map.keySet()` | yes | depends on the view/operation |
| unmodifiable backed view | `Collections.unmodifiableList(source)` | yes | no |
| fixed-size backed adapter | `Arrays.asList(array)` | yes, in both directions with the array | no, but `set` works |
| unmodifiable snapshot | `List.copyOf(source)` | not for later structural source changes | no |

A `Map` view example:

```java
Map<Long, Order> byId = new HashMap<>();
byId.put(1L, orderA);
byId.put(2L, orderB);

Set<Long> keys = byId.keySet();
keys.remove(1L);

System.out.println(byId.containsKey(1L)); // false
```

A `subList` example:

```java
List<String> source = new ArrayList<>(List.of("A", "B", "C"));
List<String> tail = source.subList(1, 3);
tail.set(0, "X");

System.out.println(source); // [A, X, C]
```

A fixed-size adapter example:

```java
String[] array = {"A", "B"};
List<String> fixed = Arrays.asList(array);

fixed.set(0, "X");
System.out.println(array[0]); // X

// fixed.add("C"); // UnsupportedOperationException
```

The important question is not only “can I call `add`?”. Ask **whether this reference shares backing storage/state with a source, which mutations are supported, and which changes are visible from the other side**.
