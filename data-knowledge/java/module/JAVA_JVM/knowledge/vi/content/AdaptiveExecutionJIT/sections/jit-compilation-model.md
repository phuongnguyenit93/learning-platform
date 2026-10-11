JIT (Just-In-Time) compilation chuyển bytecode của code đủ quan trọng thành native machine code trong lúc ứng dụng đang chạy.

Conceptual flow:

```text
method bytecode
→ collect profile
→ compilation request
→ optimizer
→ machine code
→ future calls có thể chạy compiled version
```

JIT có thể thực hiện optimization mà source compiler khó làm an toàn trước runtime, ví dụ aggressive inlining dựa trên observed receiver types.

Tuy nhiên compilation cũng tốn CPU/memory. Vì vậy runtime cần policy để chọn **code nào**, **khi nào**, và **mức tối ưu nào** đáng compile.
