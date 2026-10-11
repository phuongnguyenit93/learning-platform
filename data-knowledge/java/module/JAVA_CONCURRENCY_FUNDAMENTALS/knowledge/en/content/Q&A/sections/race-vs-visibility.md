```text
Atomicity problem
→ operation is interleft
→ lost update

Visibility problem
→ Thread does not have a guarantee of seeing the write of another Thread

Ordering problem
→ cross-thread observation without matching ordering guarantee
```

The three groups can appear together, but they should not be mixed up into a "CPU cache issue" concept.
