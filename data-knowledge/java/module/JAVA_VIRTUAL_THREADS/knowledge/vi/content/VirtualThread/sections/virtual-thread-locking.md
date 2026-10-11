Virtual thread không loại bỏ nhu cầu synchronization.

Nếu nhiều virtual threads update cùng shared mutable state:

```text
.00000 virtual threads
        +
unsafe count++
        ↓
vẫn có race condition
```

`ReentrantLock`, concurrent collections, Atomic classes và các design tránh sharing vẫn có vai trò như với platform thread.
