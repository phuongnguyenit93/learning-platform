Có thể nhóm lỗi theo vòng đời:

```text
LOOKUP
NoSuchMethodException / NoSuchFieldException
IllegalAccessException

TYPE / ADAPTATION
WrongMethodTypeException
ClassCastException trong conversion path phù hợp

CALL SITE TARGET UPDATE
WrongMethodTypeException
→ setTarget nhận MethodHandle có type khác site.type()

BOOTSTRAP / LINKAGE
BootstrapMethodError
→ bootstrap non-Error failure hoặc CallSite null/sai type
Error subclass
→ propagate trực tiếp từ bootstrap/resolution

CONCURRENCY / VISIBILITY
stale MutableCallSite target
VarHandle ordering misuse
```

Debug nên đi theo luồng thay vì thử cast ngẫu nhiên:

1. member identity đúng chưa;
2. quyền của lookup đã đúng chưa;
3. current `MethodType` là gì;
4. adapter thay type thế nào;
5. CallSite type có giữ invariant không;
6. nếu có nhiều thread, hợp đồng visibility đang dùng là gì.
