`VarHandle` là một **tham chiếu có kiểu mạnh được xác định động** (dynamically strongly typed reference) tới một variable hoặc một họ variable. Nó thống nhất nhiều dạng truy cập biến dưới cùng một abstraction và cho phép chọn access semantics rõ ràng.

Ví dụ variable có thể là:

- static field;
- instance field;
- array element;
- component nhìn qua `byte[]` hoặc `ByteBuffer` view;
- một số API foreign/off-heap sử dụng VarHandle như cơ chế truy cập phụ trợ.

VarHandle là handle bất biến và không bộc lộ mutable state cho người dùng.

Khác MethodHandle:

```text
MethodHandle
→ thao tác có thể thực thi

VarHandle
→ variable location/family
   + access-mode semantics
```
