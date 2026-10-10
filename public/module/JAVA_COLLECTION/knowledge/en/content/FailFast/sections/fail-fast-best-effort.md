A common mental model for a fail-fast iterator is:

```text
create iterator
   ↓
record expected modification state
   ↓
collection is structurally modified outside the iterator
   ↓
iterator detects a mismatch
   ↓
ConcurrentModificationException
```

The JDK describes fail-fast behavior as **best effort**. There is no absolute guarantee that an exception will be thrown for every race or at every possible point. Code that assumes “CME will protect me if anything goes wrong” is therefore incorrect.

Fail-fast is valuable because it turns an otherwise subtle traversal bug into a clearer development/debugging signal. Correctness still comes from using a valid mutation path or choosing the appropriate collection/concurrency model.
