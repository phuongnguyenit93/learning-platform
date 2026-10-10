Allocation native nên đi cùng kế hoạch giải phóng ngay tại nơi tạo tài nguyên.

~~~java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment input = arena.allocate(256);
    MemorySegment output = arena.allocate(256);

    // gọi native function với input/output
} // cả hai allocation được giải phóng tại đây
~~~

Đây là **timely deallocation**: tài nguyên được trả lại khi công việc kết thúc, không chờ GC quyết định thời điểm.

Khi một API trả về MemorySegment cho bên gọi, cần tránh làm quyền sở hữu mơ hồ. Nếu segment phụ thuộc arena của callee nhưng bên gọi dùng sau khi method return/arena close thì thiết kế đó sai vòng đời. Một lựa chọn tốt hơn là bên gọi sở hữu arena rồi truyền allocator xuống, hoặc API giữ arena sống đúng bằng vòng đời của object trả về.
