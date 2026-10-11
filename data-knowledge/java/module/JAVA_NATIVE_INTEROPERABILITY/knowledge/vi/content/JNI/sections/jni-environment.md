JNIEnv là interface pointer mà native code dùng để gọi JNI functions. Khi một Java thread đi vào native method, JVM truyền JNIEnv tương ứng với **thread hiện tại**.

Ví dụ các thao tác qua JNIEnv gồm tìm class, tạo reference, đọc field, gọi method hoặc kiểm tra exception:

~~~c
jclass cls = (*env)->GetObjectClass(env, obj);
jmethodID mid = (*env)->GetMethodID(env, cls, "name", "()Ljava/lang/String;");
jstring value = (jstring)(*env)->CallObjectMethod(env, obj, mid);
~~~

JNIEnv không phải một global handle có thể chia sẻ tùy ý giữa các thread. JNI Specification quy định interface pointer này chỉ hợp lệ trong luồng hiện tại. Native code cần giữ JavaVM nếu muốn từ một native thread khác lấy JNIEnv phù hợp thông qua luồng GetEnv/attach.

Phần JavaVM, attach/detach và vòng đời embedding được học ở chương JNI Invocation API; chương này chỉ cần hiểu JNIEnv là access point của JNI function interface.
