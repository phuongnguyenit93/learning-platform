FFM đưa một số safety property của native memory vào Java API thay vì để mọi thứ là raw pointer.

MemorySegment có **spatial bounds**: access phải nằm trong phạm vi segment. Segment cũng có **temporal bounds** thông qua scope/lifetime; access sau khi arena phù hợp đã đóng sẽ thất bại thay vì tiếp tục dereference vùng nhớ đã được giải phóng.

Arena còn biểu diễn chính sách truy cập theo luồng. Segment từ confined arena chỉ được truy cập bởi owner thread; shared arena cho phép nhiều thread truy cập nhưng không tự giải quyết data race.

Các bảo đảm này giúp bắt được nhiều lỗi ở Java boundary, nhưng không thể chứng minh native function an toàn. Nếu FunctionDescriptor sai, native code ghi ngoài vùng thực hoặc callback dùng address đã hết lifetime, JVM vẫn có thể crash hoặc memory bị corrupt.

Vì vậy “FFM safer than raw pointer” không có nghĩa “FFM eliminates native risk”.
