Use-after-close xảy ra khi code giữ MemorySegment hoặc callback address lâu hơn tài nguyên thật sự backing nó.

FFM giảm rủi ro bằng temporal safety: segment thuộc closeable Arena sẽ trở nên không hợp lệ sau khi Arena đóng và Java access tiếp theo thất bại.

~~~java
Arena arena = Arena.ofConfined();
MemorySegment segment = arena.allocate(ValueLayout.JAVA_LONG);
arena.close();

segment.get(ValueLayout.JAVA_LONG, 0); // lifetime đã kết thúc
~~~

Nhưng safety check của Java không bảo vệ native code đã lưu raw address trước đó. Nếu library giữ pointer rồi dùng sau khi Arena đóng, lỗi xảy ra ngoài vùng kiểm soát của segment.

Vì thế bất kỳ API “register pointer/callback for later” nào cũng cần protocol vòng đời tương ứng: giữ Arena sống → unregister thành công → mới close.
