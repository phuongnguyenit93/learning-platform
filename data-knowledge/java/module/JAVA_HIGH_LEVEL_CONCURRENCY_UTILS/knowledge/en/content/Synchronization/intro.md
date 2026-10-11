# Synchronization in Java

The previous section learned the problems to be solved: atomicity, visibility, ordering, and progress.

This section focuses on tools used to protect shared mutable states.

Mental model:

```text
shared mutable state
        ↓
Choosing the Right Synchronization Strategy
        ↓
synchronized / Lock / Atomic / Concurrent Collection
```

There is no one tool that is always best for every situation.
