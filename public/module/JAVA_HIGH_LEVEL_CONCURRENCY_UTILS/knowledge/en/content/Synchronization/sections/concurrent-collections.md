Concurrent collections encapsulate the synchronization strategy into the data structure.

Some important groups:

| Collection | Objectives |
| --- | --- |
| `ConcurrentHashMap` | key/value concurrent access |
| `ConcurrentSkipListMap` | concurrent sorted map |
| `CopyOnWriteArrayList` | read-heavy, write little, snapshot iteration |
| `ConcurrentLinkedQueue` | non-blocking concurrent queue |
| `BlockingQueue` | queue with semantics waiting; deep learning in Coordination |

### Atomic compound methods

With `ConcurrentHashMap`, preferably the method that represents the atomic compound operation at the collection level:

```java
map.merge(key, 1, Integer::sum);
map.computeIfAbsent(key, k -> newValue());
map.putIfAbsent(key, value);
```

Instead of writing it yourself `get()` then `put()` and assume that the two separate operations become atomic.

### CopyOnWrite snapshot

Iterator's `CopyOnWriteArrayList` Observe the snapshot at the time the Iterator is created. New Write creates a new backing array that should be appropriate when reading more than writing significantly.

The trade-off point is that each mutation may have to copy backing arrays. So this collection is not suitable for write-heavy workloads or very large collections just because of the convenient read path.

### ConcurrentLinkedQueue

`poll()` no block. When the queue is empty it returns `null`.

Therefore, consumers should not write infinite busy loops, just call `poll()` if there is no backoff/termination strategy.

`size()` of `ConcurrentLinkedQueue` should not be considered a cheap constant-time metric for hot paths. If you just need to know if a queue has an element or not, prioritize the appropriate semantics such as `isEmpty()` instead of polling `size()` continuously.

Iterator of many concurrent collections is **weakly consistent**: It can reflect a partial update concurrent that doesn't fail-fast like a normal collection, but it shouldn't be inferred that it's an absolute snapshot. `CopyOnWriteArrayList` is another case because its Iterator actually uses a snapshot backing array.

### Some APIs/types worth recognizing

There is no need to turn this chapter into a catalog API, but you should be aware of the operations that help avoid the unatomic "check and update" pattern on `ConcurrentHashMap`:

```text
putIfAbsent
compute
computeIfAbsent
computeIfPresent
merge
replace(key, oldValue, newValue)
```

The types of the same family are also worth recognizing:

```text
CopyOnWriteArraySet
ConcurrentSkipListSet
```

They don't change the main mental model: choose a collection based on the access pattern and semantics it needs, not just because the name is written `Concurrent`.

### ConcurrentSkipListMap

`ConcurrentSkipListMap` suitable when needed simultaneously:

- concurrent access;
- the key is always observed according to the sorted order;
- Navigation operations such as `firstKey`, `lastKey`, range view.

It's not "ConcurrentHashMap but faster"; the two collections serve different access patterns.

References:

```text
SynchronizationController#concurrentSkipList()
GET /synchronization/concurrent-skip-list
```

Demo multiple thread insert keys in deliberately reversed order, then observe the last set of keys still sorted.

References:

```text
SynchronizationController#concurrentCollections()
GET /synchronization/concurrent-collections
```

The experiment uses local collections and always ends, not creating an infinite running consumer daemon like the old demo.
