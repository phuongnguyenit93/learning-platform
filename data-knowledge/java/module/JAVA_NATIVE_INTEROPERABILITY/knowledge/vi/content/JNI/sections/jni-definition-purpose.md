JNI (Java Native Interface) là contract chuẩn để code Java và code native tương tác với nhau. Phía Java có thể khai báo native method; phía native nhận các JNI type và JNIEnv để thao tác với class, object, method, array, string và exception của JVM.

JNI phù hợp khi:

- hệ thống đã có native code hoặc JNI wrapper lâu năm;
- native library cần gọi ngược vào object/method Java;
- cần dùng API JNI mà ecosystem hiện hữu đã chuẩn hóa.

Đánh đổi là JNI đặt nhiều trách nhiệm lên native code: reference lifetime, thread attachment, trạng thái exception và data conversion đều phải được xử lý đúng. Một lỗi C/C++ có thể làm hỏng cả JVM process.

Trong module này JNI được học như **bridge contract**, không phải như một khóa C/C++ hay JVM internals.
