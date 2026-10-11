Java nên đi ra native khi khả năng cần thiết thực sự nằm ở native side hoặc chi phí thay thế nó bằng Java là không hợp lý. Một số tình huống điển hình:

1. **Thư viện native có sẵn** — ví dụ engine xử lý media, numerical library hoặc SDK vendor chỉ cung cấp C API.
2. **OS/hardware integration** — gọi API đặc thù của platform, driver hoặc accelerator.
3. **Native data exchange** — làm việc với binary structure, pointer, shared/mapped memory mà native component hiểu trực tiếp.
4. **Embedding** — một ứng dụng viết bằng C/C++ cần khởi tạo JVM và gọi Java code thông qua JNI Invocation API.

~~~text
Có API Java chuẩn không?
    ↓ không
Có thư viện Java/JNI đã được đóng gói và bảo trì tốt không?
    ↓ không
Có bắt buộc dùng native API/binary contract hiện hữu không?
    ↓ có
Thiết kế boundary và vòng đời rõ ràng
~~~

Đây là quyết định kiến trúc, không chỉ là quyết định syntax. Native interoperability có giá trị nhất khi boundary nhỏ, rõ và được kiểm soát.
