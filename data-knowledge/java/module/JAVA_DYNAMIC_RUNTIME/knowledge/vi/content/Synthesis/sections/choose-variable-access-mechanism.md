Dùng VarHandle khi cần variable abstraction + access semantics:

```text
ordinary field access đủ?
→ field read/write trực tiếp

runtime-selected field/array coordinate
hoặc explicit access mode/CAS?
→ VarHandle
```

Ví dụ phù hợp:

- infrastructure library cần field access handle đã resolve một lần;
- array/byte-buffer view cần typed access;
- cách triển khai concurrency primitive cần acquire/release/CAS semantics.

Ví dụ không phù hợp:

- business entity có getter/setter bình thường;
- dùng VarHandle để “tăng hiệu năng” mà chưa có benchmark;
- dùng atomic access để che một thiết kế shared state không rõ quyền sở hữu.
