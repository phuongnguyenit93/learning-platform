FunctionDescriptor dùng MemoryLayout, còn MethodHandle dùng Java **carrier type** tương ứng. Ví dụ ValueLayout.JAVA_INT có carrier là int; AddressLayout dùng MemorySegment để đại diện native address.

Khi thiết kế binding, cần phân biệt:

~~~text
native representation
    ↓ MemoryLayout
FFM carrier
    ↓
Java value truyền vào MethodHandle
~~~

Pointer thường đi qua MemorySegment, không nên tự động map sang long chỉ vì địa chỉ máy có dạng số. Trong Java 21, nếu return layout của downcall là `AddressLayout` không có target layout, `MemorySegment` trả về có size `0` và một scope mới luôn ở trạng thái alive. Nếu return `AddressLayout` có target layout `T`, size của segment trả về là `T.byteSize()`. Các bounds/scope phía Java này vẫn **không chứng minh** vùng nhớ native thật sự còn sống, do Java sở hữu hay an toàn trong khoảng đó. Vì vậy binding vẫn cần contract thật về size/lifetime; khi cần gắn bounds hoặc lifetime khác, có thể phải dùng restricted `reinterpret(...)`. Struct-by-value hoặc return value dạng group layout có thể cần allocator để Linker cấp vùng nhớ chứa kết quả.

Carrier mapping đúng không bảo đảm native semantic đúng. Ví dụ int có đúng carrier nhưng C function thực tế mong enum/range khác; kiểm tra nghiệp vụ vẫn thuộc ứng dụng.
