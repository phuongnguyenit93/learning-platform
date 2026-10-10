Heap là runtime data area dùng chung, nơi JVM cấp phát object và array. Heap được tạo khi JVM khởi động và storage cho object được quản lý bởi automatic storage-management system — thường gọi là garbage collector.

Điểm rất quan trọng:

> JVM Specification không quy định object phải được đặt liên tục, heap phải chia generation, hay collector phải dùng algorithm cụ thể.

Heap có thể fixed/dynamic theo implementation; failure vì không còn đủ storage có thể dẫn tới `OutOfMemoryError`.

Chapter tiếp theo sẽ đi sâu vào allocation, reachability và GC. Ở đây chỉ cần đặt heap đúng vị trí trong runtime-area model.
