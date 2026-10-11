Native interoperability là khả năng để code Java trao đổi dữ liệu hoặc gọi hành vi nằm ngoài Java runtime được quản lý. Phía bên kia biên có thể là một thư viện C/C++, một API của hệ điều hành, một vùng nhớ native/off-heap hoặc một ứng dụng native đang nhúng JVM.

Trong module này có hai cơ chế chính:

- **JNI (Java Native Interface)**: bridge truyền thống. Java khai báo native method, còn code native dùng JNI function interface để đọc dữ liệu, gọi method và làm việc với object của Java.
- **Foreign Function & Memory API (FFM)**: API Java hiện đại để mô tả native memory, native data layout và foreign function trực tiếp từ Java. Baseline của module là Java 21, nơi FFM vẫn là preview API.

Điểm quan trọng không phải chỉ là “Java gọi được C”, mà là hiểu **biên quản lý**. Khi execution hoặc memory đi qua biên này, các bảo đảm quen thuộc như type safety, automatic memory management hay exception propagation không còn bao phủ toàn bộ hệ thống.

~~~text
Java code
   ↓
JNI hoặc FFM
   ↓
ABI / symbol / native memory
   ↓
native library / OS / hardware
~~~
