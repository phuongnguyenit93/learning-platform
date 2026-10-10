Automatic reclamation means application code does not call `free(object)` for ordinary heap objects. The collector identifies storage that can be reused after objects are no longer part of the live graph according to collector semantics.

“Automatic” does **not** mean:

- GC runs immediately when the last strong reference disappears;
- reclamation occurs at a deterministic time;
- memory is immediately returned to the operating system;
- external resources such as files or sockets close themselves on time.

Keep this distinction:

```text
heap-object lifetime
≠ external-resource lifetime
```

External resources still need deterministic lifecycle management such as `try-with-resources`.
