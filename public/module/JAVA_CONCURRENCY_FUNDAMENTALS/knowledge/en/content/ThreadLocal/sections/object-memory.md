Java objects such as entities, DTOs, and collections are still objects on the heap.

Threads have their own stack containing frames/local references, but the fact that a reference is a local variable does not create a separate "local heap" for the object.

Thread safety depends on whether the object is shared/reachable from multiple threads and has a mutable state.

JPA persistence context/transaction isolation is its own framework/database semantics; they should not be explained by the concept of "each thread has its own heap".
