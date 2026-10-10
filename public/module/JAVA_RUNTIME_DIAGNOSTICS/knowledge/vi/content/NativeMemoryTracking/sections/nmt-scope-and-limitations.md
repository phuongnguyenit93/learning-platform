NMT theo dõi internal memory usage của HotSpot theo các category như Java Heap, Class, Thread, Code, GC, Compiler, Internal, Symbol và nhiều nhóm khác tùy build/JDK.

Điểm quan trọng là phạm vi:

- NMT theo dõi allocation mà HotSpot instrumentation biết;
- NMT **không** theo dõi allocation của third-party native code;
- NMT cũng **không** theo dõi allocation của Oracle JDK class libraries;
- NMT không phải RSS monitor của OS.

Vì vậy:

~~~text
RSS tăng
NMT tăng tương ứng
→ có khả năng JVM-managed native category đang tăng

RSS tăng
NMT gần như không tăng
→ xem xét native code ngoài NMT, mmap/file cache, hành vi allocator hoặc bộ nhớ ở cấp hệ điều hành
~~~

Không dùng “NMT không thấy tăng” để kết luận “không có native leak”.
