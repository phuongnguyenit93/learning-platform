SequenceLayout mô tả một dãy nhiều phần tử có cùng layout, tương tự cách nhìn binary của C array.

~~~java
SequenceLayout tenInts =
        MemoryLayout.sequenceLayout(10, ValueLayout.JAVA_INT);
~~~

Layout này không tự cấp phát memory; nó chỉ mô tả shape. Có thể dùng byteSize của layout để cấp phát một segment đủ lớn, hoặc dùng layout path để chọn element.

SequenceLayout đặc biệt hữu ích khi structure native chứa array cố định:

~~~text
Header
 + flags
 + values[16]
 + checksum
~~~

Khi đó array không nên được mô tả bằng 16 field rời rạc. Sequence giữ intent rõ và giúp tính offset theo index thay vì magic number.
