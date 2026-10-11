Virtual threads do not eliminate the need for synchronization.

If multiple virtual threads update share mutable state:

```text
.00000 virtual threads
        +
unsafe count++
        ↓
still have race condition
```

`ReentrantLock`, concurrent collections, atomic classes, and designs that avoid sharing still play the same role as with platform threads.
