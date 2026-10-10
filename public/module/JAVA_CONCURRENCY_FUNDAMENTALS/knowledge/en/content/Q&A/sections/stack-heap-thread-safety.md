Each Thread has its own stack.

Local variables are in the stack frame, but local variables can contain references to objects on the heap.

For example:

```java
List<String> list = sharedList;
```

`List` is a local reference, but the object it points to can still be accessed by multiple threads.

So:

```text
local variable
≠ auto thread-safe
```

The question is whether the object/state has shared mutable access.
