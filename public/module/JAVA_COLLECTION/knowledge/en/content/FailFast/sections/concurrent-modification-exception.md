The name `ConcurrentModificationException` makes it easy to assume that two threads are required. A single thread can trigger CME by mutating a collection through the collection reference while an iterator over that collection is active. The example below uses an `ArrayList` iterator directly so the detection point is explicit:

```java
List<String> users = new ArrayList<>(List.of("U01", "U02", "U03"));
Iterator<String> iterator = users.iterator();

System.out.println(iterator.next()); // U01

users.add("U04");                   // structural modification outside the iterator

iterator.next();                    // ArrayList iterator detects mismatch -> CME
```

Enhanced `for` over a collection also uses an iterator underneath, so the same principle applies when the collection is modified directly inside the loop. Fail-fast remains best-effort, however; code must not intentionally violate the traversal contract and rely on CME as a correctness mechanism.

Read CME as: **the iterator detected a modification that invalidated its traversal contract**. It does not prove a data race, and it is not a signal that should simply be caught and ignored.

In multithreaded code, choosing `ConcurrentHashMap`, `CopyOnWriteArrayList`, locking, or another ownership model is a broader concurrency decision. Concurrent collection iterators may use different contracts such as weak consistency, so the fail-fast rules of `ArrayList` do not apply to every collection.
