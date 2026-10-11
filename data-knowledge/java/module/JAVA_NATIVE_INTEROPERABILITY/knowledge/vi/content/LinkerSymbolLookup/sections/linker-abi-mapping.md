ABI mapping là bước Linker chuyển MemoryLayout/FunctionDescriptor sang quy tắc gọi thật của platform: argument nằm ở register hay stack, return value được trả như thế nào và native type/layout được truyền theo convention nào.

Linker.nativeLinker() chỉ nhắm tới ABI của platform mà JVM hiện tại đang chạy. Nó không phải cross-platform linker để Java trên Windows tạo call theo Linux ABI.

Điều này dẫn tới hai trách nhiệm tách biệt:

- **Linker**: biết cơ chế ABI của platform;
- **binding author**: cung cấp descriptor/layout đúng với native function.

Nếu library có nhiều ABI variant, ứng dụng phải chọn đúng binary trước. Linker không thể làm một Linux binary trở nên hợp lệ trên Windows hoặc sửa mismatch giữa header và library version.
