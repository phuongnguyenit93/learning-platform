JVMS runtime data areas là abstraction mô tả execution semantics. Process-level memory là cách implementation thực sự lấy virtual/native memory từ operating system để hiện thực các abstraction và subsystem của nó.

Không có mapping 1:1 bắt buộc:

```text
spec concept       implementation examples
-----------        -----------------------
heap               heap reservation/commit
method area        class metadata structures
JVM stacks         native thread stack mappings
execution engine   code cache/compiler data
```

Một implementation có thể thay đổi cấu trúc giữa các version mà vẫn conform specification.

Do đó khi đọc OS memory, hãy tránh cố ép mọi byte vào một JVMS area duy nhất.
