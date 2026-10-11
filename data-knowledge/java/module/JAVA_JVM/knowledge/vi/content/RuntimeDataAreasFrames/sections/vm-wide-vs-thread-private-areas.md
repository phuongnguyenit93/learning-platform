Một số runtime areas được tạo khi JVM khởi động và được chia sẻ giữa các thread; một số khác được tạo theo từng thread.

```text
VM-wide/shared
├─ Heap
├─ Method Area
└─ Runtime Constant Pools (gắn với class/interface)

Per-thread
├─ pc Register
├─ JVM Stack
└─ Native Method Stack (nếu implementation sử dụng)
```

Phân loại này giúp suy luận ownership và lifetime. Một local variable nằm trong frame trên JVM stack của thread hiện tại; object mà local variable trỏ tới thường nằm trên heap dùng chung.

Đây không phải Java Memory Model/happens-before. Shared-vs-thread-private ở đây là **runtime storage model**, còn visibility/order giữa thread thuộc Concurrency.
