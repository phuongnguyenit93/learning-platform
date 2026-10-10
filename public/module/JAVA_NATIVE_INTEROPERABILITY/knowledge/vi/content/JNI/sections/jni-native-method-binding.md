Một JNI native method bắt đầu từ declaration ở Java:

~~~java
public final class NativeMath {
    static {
        System.loadLibrary("native_math");
    }

    public static native int add(int a, int b);
}
~~~

Native library phải cung cấp phần triển khai tương ứng hoặc đăng ký phần triển khai bằng RegisterNatives. Với naming convention chuẩn, C function có dạng:

~~~c
JNIEXPORT jint JNICALL
Java_NativeMath_add(JNIEnv *env, jclass clazz, jint a, jint b) {
    return a + b;
}
~~~

Điểm cần giữ trong mô hình tư duy là **declaration Java chưa phải phần triển khai**. JVM phải resolve native method tới entry point hợp lệ trong library đã load. Nếu binding không khớp tên/signature hoặc symbol không tồn tại, invocation sẽ thất bại thay vì “tự tìm” một function gần giống.

RegisterNatives là lựa chọn khác khi muốn map method Java với function pointer một cách explicit; nó đặc biệt hữu ích khi naming/export strategy không dựa vào generated symbol name.
