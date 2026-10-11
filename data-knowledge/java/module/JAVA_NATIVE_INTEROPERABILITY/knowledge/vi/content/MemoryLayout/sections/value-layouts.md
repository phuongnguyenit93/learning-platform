ValueLayout mô tả một giá trị scalar trong memory và carrier Java dùng để đọc/ghi giá trị đó. Các constant quen thuộc gồm ValueLayout.JAVA_BYTE, JAVA_INT, JAVA_LONG, JAVA_FLOAT và JAVA_DOUBLE.

~~~java
ValueLayout.OfInt intLayout = ValueLayout.JAVA_INT;

try (Arena arena = Arena.ofConfined()) {
    MemorySegment segment = arena.allocate(intLayout);
    segment.set(intLayout, 0, 123);
    int value = segment.get(intLayout, 0);
}
~~~

Carrier chỉ nói Java type dùng ở API boundary; nó không có nghĩa mọi C type cùng tên đều map trực tiếp sang Java primitive tương ứng. Mapping vẫn phải dựa trên ABI của native library.

ValueLayout còn mang byte order và alignment constraint. Đây là lý do dùng layout rõ ràng tốt hơn hard-code số byte mà không biết contract.
