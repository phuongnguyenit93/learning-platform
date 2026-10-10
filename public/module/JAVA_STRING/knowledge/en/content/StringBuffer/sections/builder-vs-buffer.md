```text
no shared mutable buffer across threads
→ StringBuilder

genuinely shared synchronized character buffer required
→ consider StringBuffer
```

Often the better concurrent design is to avoid sharing one mutable builder at all.

Practical comparison:

```text
single-thread / local construction
→ StringBuilder

legacy API requires StringBuffer
→ StringBuffer

genuinely shared mutable buffer needs method-level synchronization
→ consider StringBuffer, then review the whole workflow
```

Do not choose `StringBuffer` merely because “thread-safe sounds safer”. Synchronization has a cost, and shared mutable state makes design harder.
