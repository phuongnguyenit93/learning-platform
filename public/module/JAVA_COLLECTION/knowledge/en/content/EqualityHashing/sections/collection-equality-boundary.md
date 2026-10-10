`Collection<E>` itself does **not define one universal value-equality contract for every collection implementation**. More specific subtypes may define their own equality rules.

- `List` defines equality as **same size + equal elements at corresponding positions**.
- `Set` defines equality as **the same members**, regardless of encounter order.
- `Map` defines equality as **the same mappings**.
- `Queue` generally does not impose a common element-based equality; queue/deque implementations such as `ArrayDeque` and `PriorityQueue` retain identity-based `equals/hashCode` from `Object`.

```java
Queue<Integer> a = new ArrayDeque<>(List.of(1, 2, 3));
Queue<Integer> b = new ArrayDeque<>(List.of(1, 2, 3));

System.out.println(a.equals(b)); // false: different objects
```

`LinkedList` is an important case where multiple interface roles matter: it is a `List`, so its equality follows the List value-equality contract even though it can also be used as a `Deque`.

Do not generalize “same elements means all Collections are equal.” Whole-container equality belongs to the relevant subtype/implementation contract, not to `Collection` as a universal rule.
