An object begins with an allocation request and becomes part of the application's object graph.

```text
new
→ object storage
→ constructor <init> initialization
→ references keep the object reachable
→ application changes the reference graph
→ object becomes unreachable
→ GC may reclaim its storage
```

“May reclaim” does not mean immediate reclamation. Timing depends on collector behavior and runtime state.

If application code accidentally retains a reference, the object remains live from the collector's point of view even when the business logic no longer needs it. That is a common form of managed-memory leak.
