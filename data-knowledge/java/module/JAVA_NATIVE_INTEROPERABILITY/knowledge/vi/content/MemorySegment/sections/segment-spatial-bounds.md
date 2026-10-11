**Spatial bounds** là giới hạn theo không gian của segment: mọi lần đọc/ghi phải nằm hoàn toàn trong [0, byteSize). MemorySegment kiểm tra biên này trước khi thực hiện access.

Ví dụ segment 8 byte không cho phép đọc một int bắt đầu tại offset 6 vì 4 byte dữ liệu sẽ vượt ra ngoài vùng đại diện. Dùng `JAVA_INT_UNALIGNED` ở ví dụ này để tách riêng lỗi bounds khỏi lỗi alignment:

~~~java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment segment = arena.allocate(8, ValueLayout.JAVA_INT.byteAlignment());
    segment.set(ValueLayout.JAVA_INT, 0, 100);             // hợp lệ
    segment.get(ValueLayout.JAVA_INT_UNALIGNED, 6);        // chỉ còn lỗi vượt biên
}
~~~

Ngoài size, layout access còn có alignment constraint. Do đó “offset nằm trong segment” chưa chắc đã đủ nếu offset không thỏa alignment của ValueLayout đang dùng.

Spatial safety giúp biến nhiều lỗi pointer arithmetic thành lỗi Java có thể quan sát thay vì memory corruption ngay lập tức.
