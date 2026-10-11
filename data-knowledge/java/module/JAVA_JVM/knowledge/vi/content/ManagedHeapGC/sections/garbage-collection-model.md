Garbage collector là storage-management subsystem tìm cách reclaim heap space mà không làm thay đổi Java-level semantics.

Một conceptual collector thường phải giải quyết:

1. xác định live/reachable data;
2. tìm/reclaim garbage;
3. có thể move/compact object;
4. cập nhật reference cần thiết;
5. phối hợp an toàn với các application thread.

Nhưng specification không bắt buộc collector cụ thể hay algorithm cụ thể. Collector có thể stop-the-world nhiều hơn, concurrent nhiều hơn, compact toàn phần hoặc dùng region.

Hãy học **vấn đề + đánh đổi** trước tên sản phẩm collector; như vậy kiến thức vẫn bền khi JDK thay đổi implementation.
