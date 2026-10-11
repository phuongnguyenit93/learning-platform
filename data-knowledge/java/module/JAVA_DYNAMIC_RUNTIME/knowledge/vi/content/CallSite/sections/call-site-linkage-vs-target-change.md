Hai hành vi phải tách biệt:

```text
invokedynamic linkage
→ instruction được resolve/link tới một CallSite
→ linkage này không liên tục đổi sang CallSite khác

CallSite target update
→ MutableCallSite / VolatileCallSite có thể đổi MethodHandle target
→ dynamic invoker sau đó dispatch tới target hiện tại
```

Vì vậy câu “invokedynamic relink mỗi lần target đổi” là mental model sai.

Đúng hơn:

```text
instruction
   │  link once
   ↓
CallSite
   │  target may change
   ↓
MethodHandle target
```

Phân biệt này rất quan trọng khi học bootstrap lifecycle ở chapter tiếp theo.
