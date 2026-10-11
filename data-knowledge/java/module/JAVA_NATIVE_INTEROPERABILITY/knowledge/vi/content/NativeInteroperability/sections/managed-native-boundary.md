Trong managed runtime, JVM quản lý object Java, garbage collection, type checking và nhiều rule về thread/exceptions. Native code thì chạy theo contract của platform và ABI; nó có thể thao tác địa chỉ bộ nhớ trực tiếp, gọi code không do JVM quản lý và làm hỏng process nếu contract bị vi phạm.

~~~text
Managed Java side                 Native side
-----------------                 -------------------------
Java object                       pointer / native buffer
GC-managed lifetime      ↔        explicit/native lifetime
Java type system          ↔        ABI data representation
Java exception            ↔        error code / lỗi native
Java thread model         ↔        OS/native thread
~~~

JNI và FFM không loại bỏ boundary này. Chúng chỉ cung cấp contract để vượt qua boundary có cấu trúc hơn. Vì vậy khi thiết kế tích hợp, luôn phải trả lời bốn câu hỏi: dữ liệu có layout gì, ai sở hữu tài nguyên, lifetime kết thúc khi nào và lỗi được truyền qua boundary ra sao.

JVM internals sâu hơn không thuộc module này; ở đây chỉ dùng mental model managed-vs-native đủ để lập luận về interoperability.
