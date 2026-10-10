`Queue` provides two method families for the same operations. They differ in how failure is reported:

| Intent | Throw on failure | Return special value |
| --- | --- | --- |
| insert | `add(e)` | `offer(e)` |
| remove head | `remove()` | `poll()` |
| inspect head | `element()` | `peek()` |

For an empty queue:

```java
Queue<Order> queue = new ArrayDeque<>();

Order a = queue.poll(); // null
Order b = queue.peek(); // null

// queue.remove();  // NoSuchElementException
// queue.element(); // NoSuchElementException
```

For a capacity-restricted queue, `add(e)` may throw `IllegalStateException` when an element cannot currently be added, while `offer(e)` returns `false`. Implementations such as `ArrayDeque` normally do not have that bounded-capacity failure in regular use, but the paired interface contract remains the same.

Choose the family according to the meaning of empty/full state:

- when “no element available” is normal, `poll/peek` are usually convenient;
- when emptiness violates an invariant and should fail immediately, `remove/element` may be clearer;
- when insertion can legitimately be refused, `offer` reports that outcome through its return value.

`Deque` has analogous pairs for each end, such as `addFirst/offerFirst`, `removeFirst/pollFirst`, and `getFirst/peekFirst`.
