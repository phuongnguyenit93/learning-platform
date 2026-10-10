UnionLayout mô tả nhiều member dùng **cùng một starting offset**. Đây là semantics của C union: cùng vùng bytes có thể được diễn giải theo nhiều shape khác nhau.

~~~java
UnionLayout number = MemoryLayout.unionLayout(
        ValueLayout.JAVA_INT.withName("asInt"),
        ValueLayout.JAVA_FLOAT.withName("asFloat")
);
~~~

Khác StructLayout, các member union không nằm nối tiếp. Size của union đủ để chứa member lớn nhất, và việc chọn cách diễn giải đúng thuộc trách nhiệm của protocol/native contract.

Một mẫu phổ biến là tagged union: một field tag cho biết member nào đang có hiệu lực. Java code phải đọc tag trước rồi chọn cách diễn giải phù hợp; MemoryLayout không tự biết quy tắc ngữ nghĩa đó.
