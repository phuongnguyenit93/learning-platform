`guardWithTest` chọn target theo một predicate handle:

```text
test(args)
 ├─ true  → target(args)
 └─ false → fallback(args)
```

```java
MethodHandle guarded =
        MethodHandles.guardWithTest(
                test,
                fastPath,
                fallback
        );
```

Các ràng buộc kiểu quan trọng:

- `test` phải trả về `boolean`;
- `target` và `fallback` phải có cùng type;
- tham số mà `test` nhận phải khớp với **prefix** tham số tương ứng của `target`/`fallback`; `test` có thể nhận ít tham số hơn hai handle kia.

Nếu các type không thỏa điều kiện này, `guardWithTest` ném `IllegalArgumentException` ngay khi xây adapter, trước khi handle kết quả được invoke.

`SwitchPoint` bổ sung một dạng one-way invalidation. Trước invalidation, guard đi theo target chính; sau invalidation, nó chuyển vĩnh viễn sang fallback.

```text
giả định cache còn hiệu lực
→ fast target

giả định bị vô hiệu hóa
→ SwitchPoint.invalidateAll(...)
→ fallback target từ đó về sau
```

Đây là pattern hữu ích cho runtime optimization/cache invalidation. Nó khác `MutableCallSite`: SwitchPoint biểu diễn **một giả định bị vô hiệu hóa một chiều**, còn mutable call site biểu diễn target có thể được cập nhật nhiều lần.
