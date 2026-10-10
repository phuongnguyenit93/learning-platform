Instrumentation cung cấp hai nhóm hook liên quan tới khả năng nhìn thấy:

**Đường tìm kiếm của class loader**

- appendToBootstrapClassLoaderSearch(JarFile)
- appendToSystemClassLoaderSearch(JarFile)

Chúng giúp agent đặt helper class vào đường tìm kiếm phù hợp. Nhưng bootstrap helper có khả năng nhìn thấy rất hạn chế: helper do bootstrap loader định nghĩa phải liên kết được tới những class mà loader đó nhìn thấy.

**Điều chỉnh module**

redefineModule() có thể **mở rộng** một module đang tồn tại bằng cách thêm reads, exports, opens, uses và provides. Nó không phải API thiết kế lại module graph tùy ý hoặc thu hồi quan hệ đã có.

Trước khi gọi, agent có thể dùng isModifiableModule(module). Với unnamed module, API báo modifiable nhưng redefineModule thực tế là no-op; named module mới là nơi việc mở rộng reads/exports/opens thường có ý nghĩa.

Quy ước của package Java agent còn hỗ trợ trường hợp phổ biến khi code đã biến đổi cần gọi helper: JVM bố trí để module của class đã biến đổi đọc unnamed module của bootstrap loader và system class loader. Cơ chế này không tự giải quyết mọi vấn đề exports/opens hoặc dependency của helper, nên agent vẫn phải suy luận theo loader và module cụ thể.

Mô hình tư duy:

~~~text
class đã biến đổi cần gọi helper
        ↓
helper phải có thể được nhìn thấy qua ranh giới loader/module
        ↓
hook đường tìm kiếm và/hoặc redefineModule
        ↓
chỉ mở rộng đủ cho nhu cầu instrumentation
~~~

Phần này cần nền tảng JPMS; ngữ nghĩa sâu của readability/exports/opens thuộc Java 9 Module System.
