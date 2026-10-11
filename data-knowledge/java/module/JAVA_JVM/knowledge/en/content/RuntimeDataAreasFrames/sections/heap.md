The heap is a shared runtime data area from which storage for objects and arrays is allocated. It is created when the JVM starts and is managed by an automatic storage-management system commonly called the garbage collector.

An important boundary is:

> The JVM Specification does not require a particular object placement strategy, generation layout, or garbage-collection algorithm.

The heap can be fixed or expandable depending on the implementation. If enough storage cannot be provided, execution may fail with `OutOfMemoryError`.

The next chapter goes deeper into allocation, reachability, and garbage collection. Here the goal is placing the heap correctly inside the runtime-data-area model.
