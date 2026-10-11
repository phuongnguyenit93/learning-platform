The ThreadLocal value associated with a worker can live a long time if the worker lives a long time.

Therefore:

```text
set context
→ try
→ work
→ finally remove/restore
```

is a lifecycle rule, not just a coding style.
