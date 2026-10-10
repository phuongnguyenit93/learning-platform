`PriorityQueue` still implements `Queue`, but its “next element” is determined by **priority ordering**, not insertion time.

```java
record Job(String name, int priority) {}

Queue<Job> jobs = new PriorityQueue<>(
        Comparator.comparingInt(Job::priority)
);

jobs.offer(new Job("normal", 50));
jobs.offer(new Job("urgent", 10));
jobs.offer(new Job("low", 90));

System.out.println(jobs.poll().name()); // urgent
```

With this comparator, the smallest priority number is at the head. Without a comparator, elements must provide a suitable natural ordering.

The implementation mental model is a **priority heap**:

```text
do not maintain every element in one fully sorted sequence
        ↓
maintain enough heap structure for the best-priority element to be at the head
        ↓
offer / poll restore the heap invariant
```

In the standard implementation, `offer` and `poll` are O(log n), while inspecting the head with `peek` is O(1).

One important trap: **iterating a `PriorityQueue` does not guarantee priority-sorted order**.

```java
for (Job job : jobs) {
    // Do not assume this order matches repeated poll().
}
```

If values must be consumed in priority order, repeatedly `poll` an appropriate queue, or copy the queue first when the original must be preserved:

```java
Queue<Job> copy = new PriorityQueue<>(jobs);
while (!copy.isEmpty()) {
    System.out.println(copy.poll());
}
```

Elements with equal priority also have no automatic FIFO tie-break. If tie order matters, add another comparator key such as a sequence number.
