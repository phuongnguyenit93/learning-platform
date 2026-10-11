Sau khi có symbol và descriptor, Linker tạo MethodHandle đại diện cho downcall:

~~~java
Linker linker = Linker.nativeLinker();
MemorySegment addAddress = lookup.find("add").orElseThrow();

FunctionDescriptor descriptor = FunctionDescriptor.of(
        ValueLayout.JAVA_INT,
        ValueLayout.JAVA_INT,
        ValueLayout.JAVA_INT
);

MethodHandle add = linker.downcallHandle(
        addAddress,
        descriptor);

int result = (int) add.invokeExact(10, 20);
~~~

MethodHandle ở đây là typed invocation boundary do FFM tạo ra. Nếu Java carrier type không khớp method type, invocation không hợp lệ.

Linker cũng có dạng **unbound downcall** chỉ nhận `FunctionDescriptor` khi tạo handle. Với dạng này, MethodHandle kết quả nhận địa chỉ target dưới dạng `MemorySegment` ở argument đầu tiên, phù hợp khi function pointer thay đổi theo từng lần invoke.

Không cần đi sâu vào MethodHandle adaptation/combinator trong chương này; phần đó thuộc Dynamic Runtime. Mục tiêu ở đây là hiểu handle là cầu nối từ Java call site sang foreign function.
