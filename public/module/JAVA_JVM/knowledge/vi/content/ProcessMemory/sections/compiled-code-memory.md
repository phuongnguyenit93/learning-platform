JIT-generated machine code phải nằm trong executable memory của JVM process. HotSpot quản lý vùng này bằng code-cache-related structures.

Compiled-code memory tăng theo amount/profile của code được compile, compiler policy và runtime phase. Nó không được tính là Java object heap.

```text
warm-up
→ more compilation
→ more compiled native code
→ bộ nhớ tiến trình có thể tăng
```

Điều này giúp giải thích tại sao service sau vài phút có RSS lớn hơn lúc startup dù live heap gần tương đương.

Đo/diagnose code cache cụ thể thuộc diagnostics tooling.
