Linker là thành phần FFM biết cách nối Java với foreign function theo ABI của native platform hiện tại. Trong Java 21, Linker.nativeLinker() trả về linker phù hợp với tổ hợp OS/CPU mà JVM đang chạy.

Để gọi một native function, Java cần ba mảnh thông tin:

1. **address** của function;
2. **FunctionDescriptor** mô tả input/output ở mức layout;
3. **Linker** biết cách chuyển contract đó thành lời gọi theo ABI.

~~~text
symbol address
      +
FunctionDescriptor
      +
native Linker
      ↓
downcall MethodHandle
~~~

Linker xử lý cơ chế calling convention của platform, nhưng không xác minh được rằng descriptor Java thật sự khớp function C. Contract vẫn phải do lập trình viên/library binding xác định chính xác.
