Khi nhúng JVM, nên xem JVM như một subsystem có vòng đời rõ ràng:

~~~text
chuẩn bị VM options
    ↓
JNI_CreateJavaVM
    ↓
lưu JavaVM + dùng JNIEnv của main thread
    ↓
native worker cần Java → GetEnv / attach
    ↓
thực hiện JNI work
    ↓
detach worker + giải phóng tài nguyên native
    ↓
DestroyJavaVM khi non-daemon work đã kết thúc
~~~

Các lỗi hay gặp là tạo thread nhưng quên detach, cache JNIEnv toàn cục, shutdown khi callback/native work vẫn còn sống hoặc để quyền sở hữu JavaVM pointer không rõ ràng.

Một thiết kế tốt nên có một thành phần host duy nhất sở hữu vòng đời JVM và cung cấp API nhỏ cho các native component khác. Điều này tránh việc mỗi library tự quyết định create/destroy VM độc lập.

Sau khi hoàn chỉnh JNI ở cả hai chiều, chương tiếp theo chuyển sang FFM như một model Java-facing khác cho foreign memory và C-style function contract, chứ không phải cơ chế thay thế cho JVM embedding.
