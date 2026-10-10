Heap segment giúp dùng cùng API truy cập MemorySegment với dữ liệu vốn nằm trong Java heap:

~~~java
int[] values = {10, 20, 30};
MemorySegment heap = MemorySegment.ofArray(values);
~~~

Native segment thường được cấp phát qua Arena:

~~~java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment nativeSegment = arena.allocate(16);
}
~~~

Hai segment đều có size và access API, nhưng ownership khác nhau. Heap memory vẫn chịu quản lý của JVM/GC. Native memory nằm ngoài heap và lifetime phụ thuộc arena hoặc nguồn tạo segment.

Khi truyền dữ liệu cho native function, native segment thường phù hợp hơn vì nó có địa chỉ native có thể dùng ở ABI boundary. Heap segment không nên được suy diễn thành raw native pointer tùy ý.
