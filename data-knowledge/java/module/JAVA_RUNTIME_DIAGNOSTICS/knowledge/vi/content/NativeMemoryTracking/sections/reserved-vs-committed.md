NMT thường hiển thị hai khái niệm dễ nhầm:

**Reserved**  
Không gian địa chỉ ảo JVM đã dành trước cho một mục đích. Reserved không có nghĩa toàn bộ số đó đã được backed bởi physical memory.

**Committed**  
Phần trong vùng reserved đã được commit để JVM sử dụng; đây thường gần hơn với memory thực tế mà VM có thể đang tiêu thụ, nhưng vẫn không đồng nhất tuyệt đối với RSS.

Ví dụ ý tưởng:

~~~text
Java Heap (reserved=4096MB, committed=1024MB)
~~~

Nghĩa là JVM đã reserve address space cho heap tối đa lớn hơn, trong khi chỉ một phần hiện được commit.

Khi điều tra, tránh cộng reserved rồi so trực tiếp với RSS. Hãy so category committed theo thời gian và đối chiếu với bộ nhớ ở cấp OS.
