Local-variable array là indexed slots trong frame dùng cho parameters và local state của method. Operand stack là working stack để instruction lấy operand và đặt result.

Ví dụ:

```text
iload_1   local[1] → operand stack
iload_2   local[2] → operand stack
iadd      pop 2 int, push result
ireturn   pop result và return
```

Một value Java source có thể không map đơn giản 1:1 tới một “biến vật lý” sau optimization, nhưng ở class-file/JVMS model, local variables + operand stack là nền tảng để hiểu bytecode execution.

Đây cũng là lý do đọc `javap -c` có ý nghĩa: ta có thể theo flow value qua instruction mà không cần biết machine register thật của CPU.
