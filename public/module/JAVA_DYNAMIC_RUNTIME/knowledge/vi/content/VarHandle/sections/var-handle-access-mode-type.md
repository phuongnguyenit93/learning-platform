Giống MethodHandle, access-mode methods của VarHandle là **signature-polymorphic**.

Type của một access mode được derive từ:

```text
coordinate types
+
variable type
+
access mode
```

Ví dụ với instance field `int value`:

```text
coordinates: (Counter)
variable:    int

GET
→ (Counter)int

SET
→ (Counter,int)void

COMPARE_AND_SET
→ (Counter,int,int)boolean
```

API hỗ trợ:

```java
MethodType getType =
        handle.accessModeType(
                VarHandle.AccessMode.GET
        );
```

Nếu call-site signature không tương thích, có thể gặp `WrongMethodTypeException`.

Mặc định, access-mode invocation của VarHandle dùng **invoke behavior**: runtime có thể áp dụng các conversion tương tự `MethodHandle.invoke`/`asType` khi symbolic descriptor chưa khớp chính xác nhưng vẫn có thể thích nghi với access-mode type.

```java
VarHandle exact = handle.withInvokeExactBehavior();
```

View này chuyển access-mode invocation sang **invoke-exact behavior**: call site phải khớp chính xác với `accessModeType`, nếu không sẽ ném `WrongMethodTypeException`. Có thể kiểm tra bằng `hasInvokeExactBehavior()` và quay lại behavior mặc định bằng `withInvokeBehavior()`.
