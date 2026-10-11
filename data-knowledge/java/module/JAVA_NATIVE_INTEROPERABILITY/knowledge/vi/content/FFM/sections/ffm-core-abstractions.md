FFM gồm một nhóm abstraction phối hợp với nhau:

- **MemorySegment**: một vùng nhớ liên tục có size, lifetime và access bounds.
- **Arena**: quản lý vòng đời của native segment được allocate qua arena.
- **MemoryLayout**: mô tả hình dạng dữ liệu trong memory: primitive value, struct, sequence, union, address.
- **SymbolLookup**: tìm address của named symbol trong library hoặc tập symbol đã biết.
- **FunctionDescriptor**: mô tả input/output layout của foreign function.
- **Linker**: chuyển ABI-level description thành downcall/upcall boundary mà Java có thể invoke.

Luồng điển hình:

~~~text
load/find library
    ↓
SymbolLookup.find("function")
    ↓
FunctionDescriptor mô tả signature
    ↓
Linker tạo downcall MethodHandle
    ↓
MemorySegment/Arena giữ native data và lifetime
~~~

Các chương tiếp theo tách từng abstraction để người học không phải hiểu toàn bộ FFM cùng một lúc.
