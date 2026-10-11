Một JVM process cần nhiều memory hơn nơi chứa Java objects. Ngoài heap, runtime còn cần thread stacks, class metadata, compiled code, internal VM structures, native libraries, direct buffers và memory của subsystem khác.

Vì vậy:

```text
process RSS / committed memory
≠ Java heap usage
```

Nếu dashboard chỉ nhìn `-Xmx` hoặc heap-used metric, người học có thể bỏ sót nguyên nhân tiến trình bị container/OS kill dù heap còn dư.

Chapter này xây **mô hình bộ nhớ của toàn tiến trình**. Công cụ NMT/JFR/OS metrics để đo cụ thể thuộc Runtime Diagnostics.
