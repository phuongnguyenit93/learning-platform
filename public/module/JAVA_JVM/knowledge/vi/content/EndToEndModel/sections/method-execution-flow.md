Khi method được invoke, thread nhận frame mới chứa local variables, operand stack và runtime-constant-pool reference.

```text
invoke
→ push/create frame
→ bytecode consumes locals/operand stack
→ nested invoke tạo frame mới
→ return hoặc exception
→ frame bị hủy
```

Execution engine có thể interpret bytecode hoặc chạy compiled native version của method. Dù implementation path khác nhau, observable Java semantics phải tương thích contract.

Vì vậy stack-frame model là “logical execution state”, còn CPU register/machine stack cụ thể là chi tiết triển khai.
