Lỗi đặc trưng là `WrongMethodTypeException`: descriptor phía gọi và type của handle không tương thích theo quy tắc của `invokeExact`/`invoke`.

```java
MethodHandle h = ...; // (Greeter,String)String

// Expected int, nhưng handle trả String.
int value = (int) h.invokeExact(greeter, "A");
```

Đừng nhầm lỗi kiểu với lỗi access:

```text
Lookup/find...
→ NoSuchMethodException / NoSuchFieldException
→ IllegalAccessException

invoke/adapt...
→ WrongMethodTypeException
→ ClassCastException trong conversion phù hợp một số path
```

Ngoài các lỗi của chính cơ chế MethodHandle, exception do target ném ra sẽ **truyền nguyên trạng** qua `invokeExact`/`invoke`; MethodHandle không bọc nó trong `InvocationTargetException` như `Method.invoke`. Vì API được khai báo `throws Throwable`, code gọi trực tiếp phải bắt hoặc khai báo `Throwable`/kiểu phù hợp.

Một edge case khác: `MethodType` chứa các `Class` object thật. Hai class có cùng tên nhưng được nạp bởi hai class loader khác nhau vẫn là hai type khác nhau, nên việc match MethodHandle type cũng xét class-loader identity. Nếu lỗi đi sâu vào class identity/loading, phần cơ chế thuộc module ClassLoader.

Debug checklist:

1. in `handle.type()`;
2. xác định static type của từng argument tại call site;
3. xác định expected return type do assignment/cast tạo ra;
4. nếu dùng adapter, kiểm tra type trước và sau adapter.

MethodType nên được coi như “schema của lời gọi”, không phải chi tiết phụ.
