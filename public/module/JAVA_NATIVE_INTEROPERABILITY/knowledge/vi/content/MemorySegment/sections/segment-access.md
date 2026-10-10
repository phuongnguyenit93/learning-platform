MemorySegment cung cấp get/set dựa trên ValueLayout. Layout cho biết kiểu carrier Java, kích thước, byte order và alignment mà access mong đợi.

~~~java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment segment = arena.allocate(ValueLayout.JAVA_INT);

    segment.set(ValueLayout.JAVA_INT, 0, 42);
    int value = segment.get(ValueLayout.JAVA_INT, 0);

    System.out.println(value);
}
~~~

Cách này tốt hơn tự tính pointer rồi cast vì contract truy cập được biểu diễn bằng Java object. Tuy nhiên lập trình viên vẫn phải chọn đúng layout tương ứng với dữ liệu native thật.

Với dãy giá trị đồng nhất, các method dạng index như `getAtIndex`/`setAtIndex` biểu diễn vị trí theo **chỉ số phần tử** thay vì raw byte offset:

~~~java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment values = arena.allocate(
            ValueLayout.JAVA_INT.byteSize() * 10,
            ValueLayout.JAVA_INT.byteAlignment());

    values.setAtIndex(ValueLayout.JAVA_INT, 3, 30);
    int value = values.getAtIndex(ValueLayout.JAVA_INT, 3);
}
~~~

Với chuỗi hoặc structure phức tạp, nên kết hợp MemorySegment với MemoryLayout thay vì rải các magic offset khắp code.
