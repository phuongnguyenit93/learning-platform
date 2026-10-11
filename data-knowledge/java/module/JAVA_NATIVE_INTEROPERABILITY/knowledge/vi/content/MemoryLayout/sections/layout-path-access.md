Layout path là cách chọn một member nằm sâu trong layout có cấu trúc. PathElement có thể chọn group member theo tên hoặc chọn element trong sequence.

~~~java
MemoryLayout.PathElement valueField =
        MemoryLayout.PathElement.groupElement("value");

long offset = taggedValue.byteOffset(valueField);
VarHandle handle = taggedValue.varHandle(valueField);
~~~

Ngoài `byteOffset(...)` và `varHandle(...)`, cùng path model còn hỗ trợ `select(...)` để lấy nested layout và `sliceHandle(...)` để tạo handle sinh slice cho vùng được chọn.

Điểm mạnh là access logic được derive từ layout thay vì lặp lại magic offset. Khi structure thay đổi, code dựa trên path dễ kiểm tra hơn code rải số 4, 8, 16 ở nhiều nơi.

MemoryLayout có thể tạo VarHandle cho structured access, nhưng mechanics sâu của VarHandle thuộc Dynamic Runtime. Trong module này chỉ cần hiểu VarHandle là một access mechanism mà layout có thể cung cấp; trọng tâm vẫn là native data contract.

Layout làm rõ native data contract; foreign-function call cần cùng mức kỷ luật cho function signature. Chương tiếp theo nối layout với SymbolLookup, FunctionDescriptor và Linker để Java có thể tìm và mô tả một native entry point có thể gọi.
