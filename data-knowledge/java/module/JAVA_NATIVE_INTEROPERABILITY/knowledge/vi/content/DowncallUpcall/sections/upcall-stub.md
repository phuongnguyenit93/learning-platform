Linker.upcallStub tạo một executable native address trỏ tới Java MethodHandle:

~~~java
MethodHandle comparator = lookupComparatorHandle();

try (Arena arena = Arena.ofConfined()) {
    MemorySegment stub = linker.upcallStub(
            comparator,
            comparatorDescriptor,
            arena);

    // truyền stub cho foreign function như function pointer
}
~~~

MemorySegment trả về đại diện cho địa chỉ của stub. Lifetime của stub gắn với Arena được truyền vào; đóng arena sẽ làm stub không còn hợp lệ.

Trong Java 21, upcallStub là restricted operation. Ngoài ra target MethodHandle không được để exception thoát ra qua native boundary; contract của Linker quy định rằng nếu target MethodHandle ném exception trong upcall thì JVM **sẽ terminate đột ngột**. Callback nên catch và chuyển lỗi thành contract mà native side hiểu được.
