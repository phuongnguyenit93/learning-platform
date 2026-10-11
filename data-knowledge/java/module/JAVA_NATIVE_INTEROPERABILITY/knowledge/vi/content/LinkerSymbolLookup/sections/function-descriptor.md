FunctionDescriptor là bản mô tả **native function signature ở mức MemoryLayout**. Nó cho Linker biết return value và argument được biểu diễn thế nào tại ABI boundary.

Ví dụ function C:

~~~c
int add(int a, int b);
~~~

có thể được mô tả:

~~~java
FunctionDescriptor addDescriptor = FunctionDescriptor.of(
        ValueLayout.JAVA_INT,
        ValueLayout.JAVA_INT,
        ValueLayout.JAVA_INT
);
~~~

FunctionDescriptor.ofVoid được dùng cho function không trả giá trị.

Descriptor không đọc header C để tự kiểm chứng. Nếu native signature thực tế khác — ví dụ pointer bị mô tả thành integer hoặc struct layout sai — Linker có thể tạo boundary dựa trên thông tin sai. Vì vậy descriptor là một phần của contract về tính đúng đắn, không chỉ là metadata.
