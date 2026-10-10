Java Instrumentation không phơi bày mọi khả năng công cụ của JVM.

Khi yêu cầu cần:

- event VM mức thấp không có trong java.lang.instrument;
- hook native method/runtime chuyên sâu;
- event heap/thread/GC ở tầng JVMTI;
- native agent chạy trước/ngoài mô hình Java agent;
- quyền điều khiển vượt khỏi quy ước redefine/retransform;

thì cần nghiên cứu JVMTI/native agent.

Mô hình tư duy khi chuyển giao:

~~~text
Java Instrumentation
→ Java agent mức cao + biến đổi class file

JVMTI
→ giao diện công cụ native của VM với tập event/khả năng rộng hơn
~~~

Đừng “lách” các ràng buộc của Java Instrumentation bằng thủ thuật bytecode không được hỗ trợ. Nếu quy ước API không đủ, hãy chuyển sang đúng lớp công cụ mức thấp hơn.
