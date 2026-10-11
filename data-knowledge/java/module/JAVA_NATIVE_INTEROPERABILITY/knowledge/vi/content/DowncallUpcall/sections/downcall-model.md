**Downcall** là hướng Java gọi một foreign function. Đây là luồng phổ biến nhất khi ứng dụng Java muốn dùng C API có sẵn.

FFM cần biết:

1. địa chỉ function;
2. FunctionDescriptor của function;
3. Linker cho ABI hiện tại.

~~~text
Java
  ↓ invoke MethodHandle
Linker
  ↓ ABI adaptation
foreign function
~~~

Downcall không tự động hiểu C header. Nếu descriptor hoặc symbol sai, Linker vẫn đang làm việc trên contract do Java cung cấp. Vì vậy tính đúng đắn của binding vẫn là trách nhiệm của code tích hợp.
