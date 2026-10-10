Lifetime của native memory không được GC quản lý theo cùng cách với Java object. Nếu vùng nhớ bị giải phóng quá sớm, pointer trở thành dangling; nếu không bao giờ giải phóng, process bị leak native memory.

Arena đưa lifetime đó thành một boundary có thể nhìn thấy trong code:

~~~java
MemorySegment segment;

try (Arena arena = Arena.ofConfined()) {
    segment = arena.allocate(128);
    // segment hợp lệ trong lifetime của arena
}

// segment không còn hợp lệ ở đây
~~~

FFM kiểm tra temporal validity trước khi access segment. Vì vậy use-after-close thường trở thành IllegalStateException thay vì âm thầm dereference vùng nhớ đã free.

Thiết kế tốt là đặt arena gần vòng đời của công việc: một request, một thao tác native hoặc một component có điểm kết thúc rõ ràng.
