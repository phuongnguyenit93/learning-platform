`MethodHandles.Lookup` là factory dùng để tạo `MethodHandle` hoặc `VarHandle` khi việc tạo đó cần access checking. Điểm quan trọng: **quyền được kiểm tra lúc handle được tạo, không phải mỗi lần handle được invoke**.

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
```

`lookup` giữ một lookup class và tập lookup modes. Vì vậy có thể xem nó như một object mang quyền: code nào giữ lookup nào thì chỉ có thể tạo những handle tương ứng với quyền của lookup đó.

Mental model:

```text
class của bên gọi / lookup class
        +
lookup modes
        ↓
quyền của Lookup
        ↓
findVirtual / findStatic / findConstructor / findVarHandle ...
        ↓
access check xảy ra tại đây
        ↓
handle đã tạo có thể invoke mà không re-check member access mỗi lần
```

Đây là lý do không nên coi `Lookup` chỉ là “helper class để tìm method”.
