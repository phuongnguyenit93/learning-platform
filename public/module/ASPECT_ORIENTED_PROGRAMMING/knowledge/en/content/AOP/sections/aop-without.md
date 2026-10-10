A simpler approach is to call helpers, wrappers, or decorators explicitly:

```text
business code
→ call logging helper
→ call audit helper
→ run primary logic
```

This is completely valid and is often clearer when the concern appears in only a few places.
