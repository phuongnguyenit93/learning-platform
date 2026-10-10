Mỗi VarHandle có:

- **variable type** `T`: kiểu giá trị được đọc/ghi;
- **coordinate types**: các giá trị cần để định vị variable cụ thể.

Ví dụ instance field:

```text
class Counter { int value; }

VarHandle tới Counter.value

variable type:
int

coordinate types:
(Counter)
```

Array element:

```text
int[] array

variable type:
int

coordinate types:
(int[], int)
          ↑ index
```

Tư duy theo coordinates giúp hiểu signature của `get`, `set`, `compareAndSet` mà không học thuộc từng method.
