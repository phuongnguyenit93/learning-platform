Three similarly named things should stay separate:

- `Collection<E>` is the root interface for groups of elements such as lists, sets, and queues;
- `Collections` is a utility class containing static algorithms/helpers such as `sort`, `reverse`, `binarySearch`, and wrapper factories;
- the **Java Collections Framework** is the whole family of collection/map interfaces, implementations, and related algorithms/utilities.

`Map<K, V>` belongs to the Java Collections Framework but does not extend `Collection<E>`; the next section explains why.

Once the learner understands **why a group abstraction is needed**, the hierarchy becomes useful: it answers **which behavior does this group require?**

A useful high-level roadmap for the module is:

```text
Why does the Collections Framework exist?
        ↓
What core contracts solve different data problems?
List / Set / Map / Queue / Deque
        ↓
How can code traverse them through common protocols?
Iterator / ListIterator / Spliterator boundary
        ↓
How do ordering, comparison, and navigation work?
        ↓
How do equality and hashing affect lookup correctness?
        ↓
Who owns mutation, and how do views/fail-fast behavior change it?
        ↓
How do we choose an implementation or specialized structure?
```

The next four chapters expand the second milestone into `List`, `Set`, `Map`, and `Queue`/`Deque`. Later chapters then revisit those contracts through traversal, ordering, equality/hashing, mutation, and implementation choice. By the end of the module, the goal is to start from **required behavior** and select an interface and implementation deliberately, instead of defaulting to `ArrayList` or `HashMap` by habit.
