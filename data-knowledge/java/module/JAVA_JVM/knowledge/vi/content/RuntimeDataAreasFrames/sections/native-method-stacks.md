JVM implementation có thể sử dụng native method stack để hỗ trợ method được hiện thực bằng ngôn ngữ native hoặc runtime native mechanism.

Specification cho phép implementation tự quyết cách tổ chức vùng này; thậm chí một implementation không hỗ trợ native method theo cách đó có thể không cần native method stack riêng.

Trong module JVM, mục đích là hiểu rằng việc thực thi ứng dụng Java có thể cần stack/resource ngoài JVM frame model. Việc gọi native function qua JNI hoặc FFM thuộc **Native Interoperability**, không mở rộng ở đây.
