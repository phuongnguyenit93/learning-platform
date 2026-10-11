JavaVM có ba nhóm thao tác cần phân biệt: **kiểm tra trạng thái**, **attach**, và **detach**.

- GetEnv trả JNIEnv nếu luồng hiện tại đã attach; nếu chưa, kết quả là JNI_EDETACHED.
- AttachCurrentThread attach current native thread dưới dạng non-daemon và trả JNIEnv.
- AttachCurrentThreadAsDaemon attach với daemon status.
- DetachCurrentThread tách thread khỏi JVM trước khi native thread kết thúc; thread không thể detach khi Java methods vẫn còn trên call stack của chính nó.

~~~c
JNIEnv *env = NULL;
jint rc = (*vm)->GetEnv(vm, (void **) &env, JNI_VERSION_21);

if (rc == JNI_EDETACHED) {
    rc = (*vm)->AttachCurrentThread(vm, (void **) &env, NULL);
}
~~~

Daemon attachment quan trọng ở shutdown semantics: daemon thread không ngăn JVM termination giống non-daemon attached thread. Tuy nhiên daemon không có nghĩa là “không cần giải phóng”; tài nguyên native vẫn phải được release đúng vòng đời.

Luôn lấy JNIEnv theo luồng hiện tại. Không chuyển một JNIEnv pointer đã lấy ở thread A sang thread B.
