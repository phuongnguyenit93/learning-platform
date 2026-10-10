| Problem Groups | Questions | Examples |
| --- | --- | --- |
| Atomicity | Is an operation interrupted? | Lost Update with `count++` |
| Visibility | Are other threads guaranteed to see write? | stale flag/data |
| Ordering | What are the actions observed by other Threads? | Publication without happens-before |
| Progress | Does Thread/system continue to get work done? | Deadlock, Livelock, Starvation |

Mental Final Model:

```text
Concurrency correctness
    ├── state correctness
    │ ├── atomicity
    │ ├── visibility
    │ └── ordering
    │
    └── progress / liveness
           ├── deadlock
           ├── LiveLock
           └── Starvation
```

There is no single keyword that solves every problem.

The next chapter is just starting to learn specific tools:

```text
synchronized
Lock
Atomic
Concurrent Collection
...
```
