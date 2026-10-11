Khi thấy native memory tăng, đừng chỉ nhìn tổng số. Hãy hỏi category nào tăng và nó có hợp với workload hay không.

Ví dụ:

- **Thread** tăng cùng số platform threads → kiểm tra thread creation/stack size;
- **Class** tăng cùng dynamic class loading → kiểm tra classloader lifecycle;
- **Code** tăng trong warm-up → có thể liên quan JIT/code cache;
- **GC/Internal** tăng → cần JVM-level interpretation;
- NMT ổn nhưng RSS tăng → nghi ngờ memory ngoài HotSpot tracking.

Quy trình:

~~~text
OS RSS trend
   + NMT summary.diff
        ↓
identify growing category
        ↓
đối chiếu với hành vi thread/class/JFR/ứng dụng
        ↓
quyết định chuyển sang JVM / native / ứng dụng
~~~

NMT giúp thu hẹp phạm vi tìm kiếm; nó hiếm khi tự chỉ ra object/hàm “gây leak” cuối cùng.
