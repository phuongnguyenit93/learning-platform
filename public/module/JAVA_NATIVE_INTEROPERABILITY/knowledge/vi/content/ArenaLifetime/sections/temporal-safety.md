Temporal safety trả lời câu hỏi: **segment còn sống tại thời điểm access hay không?**

Với closeable arena, mọi segment thuộc arena chỉ hợp lệ cho tới khi arena đóng. Sau đó các thao tác đọc/ghi sẽ thất bại:

~~~java
Arena arena = Arena.ofConfined();
MemorySegment segment = arena.allocate(ValueLayout.JAVA_LONG);

arena.close();
segment.get(ValueLayout.JAVA_LONG, 0); // IllegalStateException
~~~

Điều này khác spatial safety. Spatial safety kiểm tra offset/size; temporal safety kiểm tra vòng đời. Một access có thể nằm đúng offset nhưng vẫn sai vì tài nguyên đã hết hạn.

Native code bên ngoài FFM vẫn có thể giữ raw address lâu hơn lifetime Java mong đợi. Vì vậy khi truyền pointer cho native library để lưu dùng về sau, phải mở rộng lifetime của backing arena tương ứng hoặc thiết kế protocol unregister/giải phóng rõ ràng.
