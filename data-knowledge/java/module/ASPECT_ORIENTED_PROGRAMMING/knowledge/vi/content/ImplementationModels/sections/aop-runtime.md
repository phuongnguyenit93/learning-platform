Một số implementation áp dụng cross-cutting behavior tại runtime thông qua một lớp trung gian hoặc interception mechanism.

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
