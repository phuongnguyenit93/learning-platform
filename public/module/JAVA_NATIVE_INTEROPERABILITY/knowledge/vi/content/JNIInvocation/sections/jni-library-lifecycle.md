JNI library có thể định nghĩa hook vòng đời để khai báo version JNI cần dùng và thực hiện khởi tạo/giải phóng.

**JNI_OnLoad** được JVM gọi khi dynamically linked JNI library được load. Function trả về JNI version tối thiểu mà library yêu cầu:

~~~c
JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *reserved) {
    return JNI_VERSION_21;
}
~~~

Nếu VM không nhận diện version được trả về, library bị xem như load thất bại.

**JNI_OnUnload** có thể được gọi khi class loader chứa native library bị garbage collected. Đây là nơi phù hợp để giải phóng tài nguyên thuộc library, nhưng JNI Specification yêu cầu thận trọng vì hook có thể chạy trong context không xác định; không nên thực hiện callback Java tùy ý tại đây.

Library/version management cũng gắn với class loader: mỗi class loader quản lý tập native library của nó, và cùng một JNI library không thể được load vào nhiều class loader theo cách tùy ý. Vì vậy hook vòng đời không chỉ là startup/shutdown callback mà là một phần của loading contract.
