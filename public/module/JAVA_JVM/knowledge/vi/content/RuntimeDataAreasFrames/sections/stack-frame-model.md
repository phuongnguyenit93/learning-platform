Frame là execution context cho **một method invocation**. JVMS mô tả frame chứa ba nhóm chính:

```text
Frame
├─ local variables
├─ operand stack
└─ reference tới runtime constant pool của current class
```

Frame còn phục vụ dynamic linking, method return và exception dispatch.

Size cần cho local-variable array và operand stack được biết từ class-file method metadata, cho phép runtime chuẩn bị frame phù hợp khi method được invoke.

Mental model này quan trọng vì bytecode instruction phần lớn không thao tác trực tiếp với “biến Java source”; chúng thao tác với local slots và operand stack trong frame.
