JNI_GetCreatedJavaVMs chỉ nhìn thấy JVM đã được tạo **trong process hiện tại**. Nó không phải API để scan JVM của process khác hay thay thế tool diagnostics.

~~~c
JavaVM *vms[1];
jsize count = 0;

jint rc = JNI_GetCreatedJavaVMs(vms, 1, &count);
if (rc == JNI_OK && count > 0) {
    JavaVM *vm = vms[0];
}
~~~

Hàm ghi tối đa bufLen JavaVM pointer vào buffer và trả tổng số VM đã tạo qua nVMs. Do việc tạo nhiều JVM trong một process không được hỗ trợ, ứng dụng thông thường chỉ cần lập luận quanh tối đa một JVM đang hoạt động.

Use case điển hình là native component được load vào một process đã host JVM và cần lấy JavaVM pointer thay vì tự tạo VM mới.
