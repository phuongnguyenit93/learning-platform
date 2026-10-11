JNI và FFM cùng giải quyết Java ↔ native interoperability nhưng tiếp cận khác nhau.

**JNI** tập trung vào bridge giữa JVM và phần triển khai native method. Native code nhận JNIEnv và có API phong phú để thao tác object/class/method Java. Đây là lựa chọn tự nhiên khi đã có JNI code hoặc native side cần tích hợp sâu với Java object model.

**FFM** tập trung vào foreign function và foreign memory. Java mô tả address, signature và data layout bằng MemorySegment, FunctionDescriptor, MemoryLayout và Linker. Với C-style library API, điều này thường giảm số lượng handwritten JNI glue.

Không nên xem FFM là “JNI nhưng nhanh hơn” hay JNI là “FFM cũ”. Chúng có mô hình lập trình khác nhau. Tiêu chí chọn cần dựa trên bề mặt native hiện hữu, callback/data model, khả năng bảo trì, JDK baseline và ràng buộc triển khai.
