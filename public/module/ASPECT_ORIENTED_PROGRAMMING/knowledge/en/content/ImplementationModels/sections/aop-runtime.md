Some implementations apply cross-cutting behavior at runtime through an intermediate layer or interception mechanism.

Mental model:

```text
caller
  ↓
interception boundary
  ↓
cross-cutting behavior
  ↓
target
```
