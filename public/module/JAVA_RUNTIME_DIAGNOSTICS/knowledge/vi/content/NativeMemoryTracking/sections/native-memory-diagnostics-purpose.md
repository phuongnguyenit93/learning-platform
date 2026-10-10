Java heap chỉ là một phần bộ nhớ của tiến trình JVM. Khi RSS/bộ nhớ tiến trình tăng nhưng heap sau GC vẫn ổn định, hoặc container bị OOMKill dù Java heap chưa chạm `-Xmx`, cần nhìn sang **native memory**.

Nguồn native memory có thể gồm:

- metaspace/class metadata;
- thread stacks;
- code cache/JIT;
- GC internal structures;
- direct/native buffers;
- JNI hoặc thư viện native;
- memory mapping và cấu trúc VM khác.

Native Memory Tracking (NMT) giúp quan sát phần bộ nhớ do HotSpot quản lý. Nó không thay thế số liệu từ hệ điều hành và cũng không nhìn thấy toàn bộ native allocation của ứng dụng/thư viện bên thứ ba.

Mental model:

~~~text
RSS tiến trình / virtual memory
        ├─ Java heap
        ├─ HotSpot-managed native memory  ← NMT quan sát phần lớn nhóm này
        └─ native memory của ứng dụng / bên thứ ba
~~~

NMT đặc biệt hữu ích khi câu hỏi là “JVM đang dùng native memory ở category nào và category nào tăng theo thời gian?”.
