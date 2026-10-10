Arena là abstraction của FFM dùng để **quản lý lifetime của native memory** và quy định segment nào được truy cập từ những luồng nào. Arena đồng thời là SegmentAllocator nên có thể cấp phát native segment trực tiếp.

Thay vì mỗi allocation có một lệnh free riêng rẽ, nhiều segment có thể cùng thuộc một arena. Khi closeable arena đóng, toàn bộ native memory do arena đó quản lý được giải phóng và các segment liên quan trở nên không còn hợp lệ.

Mental model nên là:

~~~text
Arena
 ├─ segment A
 ├─ segment B
 └─ segment C

close Arena
→ lifetime của A/B/C kết thúc cùng boundary
~~~

Cách tổ chức này giúp ownership trở nên explicit hơn raw pointer, đặc biệt khi một tác vụ native cần nhiều allocation có cùng vòng đời.
