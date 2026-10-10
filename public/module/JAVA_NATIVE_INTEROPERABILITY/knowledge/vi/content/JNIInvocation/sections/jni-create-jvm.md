JNI_CreateJavaVM load và initialize JVM trong native process:

~~~c
JavaVM *vm = NULL;
JNIEnv *env = NULL;

jint rc = JNI_CreateJavaVM(&vm, (void **) &env, &args);
if (rc != JNI_OK) {
    /* xử lý lỗi khởi động */
}
~~~

Khi thành công, luồng hiện tại được attach vào JVM và trở thành main thread của JVM; env là JNIEnv dành cho thread đó.

JNI Specification không hỗ trợ tạo nhiều JVM trong cùng một process. Vì vậy giả định kiến trúc nên là **một native process host một JVM**, thay vì xem JNI_CreateJavaVM như factory có thể tạo nhiều VM độc lập.

Host cũng phải quyết định rõ ai sở hữu vòng đời: component nào start VM, component nào giữ JavaVM pointer và ai chịu trách nhiệm shutdown.
