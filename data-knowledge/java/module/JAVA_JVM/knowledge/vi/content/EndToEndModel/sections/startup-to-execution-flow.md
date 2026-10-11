Khi JVM process khởi động, runtime thiết lập VM-wide structures, threads và chọn runtime policies/ergonomic defaults cần thiết. Initial class/entry point của ứng dụng sau đó được load, linked và initialized theo lifecycle rules trước khi method execution tiến triển.

Mental flow:

```text
process startup
→ JVM runtime initialization
→ initial class loading/linking/initialization
→ main/entry method frame
→ bytecode execution
→ adaptive optimization theo thời gian
```

Flow này không có nghĩa JVM eagerly load mọi class ngay startup. Class loading/linking có thể diễn ra động khi execution cần thêm types.
