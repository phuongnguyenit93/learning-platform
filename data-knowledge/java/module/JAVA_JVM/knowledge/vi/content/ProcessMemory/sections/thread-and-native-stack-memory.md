Mỗi platform thread cần stack memory ở cấp tiến trình. Nhiều thread vì vậy có thể tạo mức chiếm dụng bộ nhớ đáng kể ngay cả khi mỗi thread gần như không allocate object trên heap.

Conceptual:

```text
N platform threads
× per-thread stack reservation
→ process virtual/native memory pressure
```

`-Xss` là HotSpot control liên quan thread stack sizing, không phải universal Java-language setting.

Virtual threads có runtime architecture khác về scheduling/stack representation, nhưng concurrency model chi tiết thuộc module Concurrency/Virtual Threads. Ở đây chỉ cần hiểu “số lượng thread có thể ảnh hưởng bộ nhớ tiến trình”.
