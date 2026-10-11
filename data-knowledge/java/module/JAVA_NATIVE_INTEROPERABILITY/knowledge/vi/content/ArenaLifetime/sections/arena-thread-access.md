Arena còn xác định **chính sách truy cập theo luồng**.

Segment từ `Arena.ofConfined()` chỉ được truy cập bởi owner thread. Chính thao tác `close()` trên confined Arena cũng bị ràng buộc bởi owner thread; close từ luồng khác thất bại với `WrongThreadException`. Truy cập segment từ luồng khác cũng thất bại thay vì âm thầm tạo data race:

~~~java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment segment = arena.allocate(8);
    // chỉ owner thread nên access segment này
}
~~~

Khi thật sự cần chia sẻ segment, Arena.ofShared() cho phép nhiều luồng truy cập. Nhưng shared arena chỉ mở quyền truy cập; nó **không tự đồng bộ dữ liệu**. Nếu hai luồng cùng ghi cùng vùng nhớ, ứng dụng vẫn cần protocol đồng bộ phù hợp.

Vì thế chọn shared arena không nên là cách né WrongThreadException. Hãy bắt đầu từ câu hỏi về quyền sở hữu: dữ liệu có thật sự cần chia sẻ không, và ai phối hợp việc close khi các luồng vẫn còn dùng tài nguyên?

Khi một vùng memory đã có bounds, lifetime và thread accessibility rõ ràng, câu hỏi tiếp theo là các byte trong vùng đó mang ý nghĩa gì. Chương kế tiếp dùng MemoryLayout để mô tả size, alignment, field placement và pointer-shaped data.
