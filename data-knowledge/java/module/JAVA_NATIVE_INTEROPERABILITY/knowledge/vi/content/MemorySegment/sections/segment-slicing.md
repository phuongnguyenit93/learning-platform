Slice là một view mới trên **cùng backing memory**, thường bắt đầu tại offset và có size nhỏ hơn. Nó không copy dữ liệu.

~~~java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment whole = arena.allocate(16, ValueLayout.JAVA_INT.byteAlignment());
    MemorySegment firstInt = whole.asSlice(0, Integer.BYTES);

    firstInt.set(ValueLayout.JAVA_INT, 0, 7);
    int sameValue = whole.get(ValueLayout.JAVA_INT, 0);
}
~~~

Vì share backing memory nên thay đổi qua slice được nhìn thấy từ segment gốc và ngược lại. Slice cũng không tạo lifetime độc lập: nếu arena của backing memory đóng, mọi view liên quan đều mất hiệu lực.

Slice hữu ích để tách một buffer lớn thành các vùng logic mà vẫn giữ boundary check cho từng vùng. Khi thiết kế parser/native structure, điều này giúp code rõ hơn so với tự cộng offset ở mọi nơi.

Bounds trả lời segment được phép access **ở đâu**, nhưng chưa trả lời access đó hợp lệ **đến khi nào**. Chương tiếp theo đưa vào Arena như owner của native-allocation lifetime và thread-access policy.
