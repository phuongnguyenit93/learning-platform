JNI Invocation API giải quyết chiều ngược với native method thông thường: thay vì JVM khởi chạy trước rồi Java gọi native code, một **ứng dụng native** có thể tạo/host JVM và sau đó dùng JNI để gọi Java.

API này xoay quanh JavaVM, là interface ở cấp VM. Native host có thể:

- tạo JVM và nhận JNIEnv cho thread khởi tạo;
- kiểm tra JVM đã được tạo trong process hiện tại;
- attach/detach các native thread;
- lấy JNIEnv của thread hiện tại bằng GetEnv;
- yêu cầu JVM shutdown bằng DestroyJavaVM.

Đây vẫn là native interoperability, không phải process administration. Mục tiêu là quản lý vòng đời của JVM **bên trong cùng native process** và giữ boundary giữa thread/tài nguyên rõ ràng.
