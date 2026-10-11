Mỗi class/interface có một runtime constant pool được xây từ constant pool trong biểu diễn class file. Nó thuộc method-area-level runtime state theo JVMS.

Runtime constant pool chứa static constants và symbolic references phục vụ resolution/execution. Vì vậy nó nối hai chapter:

```text
class file constant_pool
        ↓ class creation
runtime constant pool
        ↓ resolution/execution
hành vi runtime
```

Điểm này giải thích vì sao constant pool vừa xuất hiện trong chapter class file vừa xuất hiện trong chapter runtime data: cùng concept nhưng ở **hai biểu diễn khác nhau theo lifecycle**.
