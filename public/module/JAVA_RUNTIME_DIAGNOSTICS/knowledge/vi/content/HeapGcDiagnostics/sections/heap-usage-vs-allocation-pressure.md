Ba khái niệm thường bị trộn lẫn:

**Heap usage**  
Lượng Java heap đang được sử dụng tại một thời điểm.

**Allocation pressure**  
Tốc độ tạo object mới. Allocation cao có thể làm GC chạy thường xuyên nhưng không đồng nghĩa leak.

**Memory pressure**  
Tình trạng ứng dụng/JVM thiếu dư địa bộ nhớ do heap, native memory hoặc giới hạn container/OS.

Ví dụ:

~~~text
allocation rate cao
GC thu hồi tốt
post-GC heap ổn định
→ chưa có bằng chứng leak

post-GC heap tăng dần qua thời gian
→ cần điều tra khả năng object bị giữ lại
~~~

Vì vậy hãy nhìn usage **sau GC** và trend theo thời gian, không chỉ một peak.
