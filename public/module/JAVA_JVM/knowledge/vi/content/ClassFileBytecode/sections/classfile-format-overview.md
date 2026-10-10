Class file là một biểu diễn nhị phân có cấu trúc chặt chẽ. Mỗi class file mô tả một class, interface hoặc module theo version của class-file format tương ứng.

Ở mức cao, nó chứa:

```text
magic + version
constant_pool
access_flags
this_class / super_class / interfaces
fields
methods
attributes
```

Magic value `0xCAFEBABE` cho phép runtime nhận diện format; major/minor version giúp JVM xác định artifact có dùng class-file version mà runtime hiện tại hỗ trợ hay không.

Đừng hiểu class file như “mã nguồn Java đã nén lại”. Nó là một biểu diễn riêng, có vocabulary và constraint riêng, được thiết kế cho JVM execution.
