Một cách đọc call chain:

```text
Controller
→ AOP Proxy
→ Pointcut chọn Join Point
→ Advice chạy
→ Target Object
```

Aspect là nơi gom cross-cutting behavior; Advice là behavior cụ thể chạy tại một join point được pointcut chọn.
