Khi một Java thread gọi native method, thread đó đã thuộc JVM và nhận JNIEnv hợp lệ cho chính nó. Trường hợp khác xảy ra khi native library tự tạo OS thread và thread đó muốn gọi Java: thread phải được attach vào JVM trước.

Điểm quan trọng:

- JNIEnv gắn với thread, không cache rồi dùng từ thread khác;
- native-created thread cần attach trước khi dùng JNI;
- native thread đã attach phải detach trước khi chính thread đó kết thúc; daemon status chỉ ảnh hưởng JVM shutdown semantics, không miễn yêu cầu detach;
- JNI reference và trạng thái native chia sẻ giữa thread vẫn cần concurrency discipline riêng.

~~~text
Java thread → native method
    JVM đã attach → có JNIEnv

native-created thread → muốn gọi Java
    attach → lấy JNIEnv → gọi JNI → detach
~~~

Chi tiết GetEnv, AttachCurrentThread, AttachCurrentThreadAsDaemon và DetachCurrentThread thuộc chương Invocation API kế tiếp. Ở đây mục tiêu là hiểu rằng thread identity là một phần của JNI boundary.

Chương Invocation API sẽ mở rộng chính boundary đó từ một native method đơn lẻ thành lifecycle của native application khi host JVM, bao gồm startup, attach/detach và shutdown.
