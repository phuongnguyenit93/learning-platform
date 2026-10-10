`ByteBuffer.allocateDirect` tạo một **direct byte buffer**. API contract của Java không định nghĩa đơn giản “direct = off-heap”; điều nó đảm bảo là JVM sẽ cố gắng thực hiện native I/O trực tiếp trên buffer để tránh copy qua buffer trung gian khi có thể. Trong HotSpot, nội dung của direct buffer thường được backing bằng native memory, vì vậy mức chiếm dụng này có thể không xuất hiện như ordinary Java-heap usage.

```java
ByteBuffer buffer = ByteBuffer.allocateDirect(1 << 20);
```

“Off-heap” là thuật ngữ rộng; không phải mọi native memory đều là direct buffer và không phải mọi cơ chế ngoài heap có cùng lifecycle.

Quy tắc:

```text
heap monitoring
→ không đủ để quan sát toàn bộ bộ nhớ của ứng dụng
```

FFM/JNI native-memory programming chuyên sâu thuộc Native Interoperability.
