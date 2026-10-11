Runtime Extensibility đứng cạnh nhiều topic Java khác nhưng không sở hữu toàn bộ chúng.

```text
ClassLoader
→ class identity, delegation, visibility, loader lifecycle

JPMS
→ module descriptor, readability, exports/opens, resolution nói chung

Runtime Extensibility
→ service/provider contract, discovery, plugin architecture,
   service binding và ModuleLayer integration

Instrumentation
→ sửa/quan sát bytecode hoặc class đã được JVM load
```

Ví dụ: plugin isolation có thể cần custom `ClassLoader`, nhưng module này chỉ học **vì sao isolation cần loader boundary** và cách nó ảnh hưởng plugin design. Chi tiết delegation model thuộc ClassLoader curriculum.

Tương tự, module này dùng `requires`, `uses`, `provides`, `Configuration` và `ModuleLayer` vì chúng phục vụ extensibility. Nó không dạy lại toàn bộ JPMS.

Một boundary đặc biệt quan trọng:

```text
load một provider mới
≠
redefine class đang chạy
```

Trường hợp thứ nhất là extensibility. Trường hợp thứ hai thuộc Instrumentation/agent model.
