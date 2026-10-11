Java có nhiều mức extensibility. Không phải hệ thống nào cũng cần `ModuleLayer`.

```text
1. Static wiring
   Host biết implementation cụ thể.

2. Interface + configurable wiring
   Host phụ thuộc contract, configuration chọn implementation.

3. ServiceLoader trên class path/module path
   Provider được phát hiện từ runtime environment.

4. Plugin architecture
   Host thêm selection, lifecycle, failure boundary, compatibility policy.

5. ModuleLayer-based composition
   Host resolve và define một graph named module mới trong JVM.
```

Mỗi mức thêm flexibility nhưng cũng tăng complexity.

Ví dụ, `ServiceLoader` chỉ giải quyết **discovery/loading**. Nó không tự cung cấp plugin lifecycle, dependency conflict resolution, hot-unload, version negotiation hay retry policy. Những capability đó phải do architecture của application thiết kế.

Nguyên tắc xuyên suốt module:

> Chọn cơ chế đơn giản nhất vẫn đáp ứng đúng boundary và lifecycle requirement của hệ thống.
