A virtual thread that calls the blocking API is still **semantically blocked**.

The difference is that the JVM can free up the carrier while the virtual thread is waiting if the operation supports unmounting.

So don't say:

```text
Virtual Thread = non-blocking programming
```

Rather:

```text
Blocking Style Code
        +
cheap virtual-thread suspension
        ↓
High Concurrency with Familiar Sequential Programming Model
```
