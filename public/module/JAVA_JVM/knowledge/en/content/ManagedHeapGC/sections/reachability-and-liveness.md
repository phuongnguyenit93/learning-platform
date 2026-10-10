Garbage collection cannot decide object lifetime simply by asking “how old is this object?” The more important question is whether an object remains **reachable from runtime roots through the reference graph**.

```text
GC roots
  ↓
reachable object graph
  ↓
objects that must remain live

unreachable objects
  ↓
storage can eventually be reclaimed
```

A managed-memory leak often happens because application logic accidentally retains a strong reference, so an object remains reachable even though the business logic no longer needs it.

Reachability is therefore where application reference design meets garbage-collector behavior.
