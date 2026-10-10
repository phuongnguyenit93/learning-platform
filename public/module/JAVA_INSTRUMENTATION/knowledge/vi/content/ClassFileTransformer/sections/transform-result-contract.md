Transformer có ba kết quả thực tế:

**Không thay đổi**

~~~java
return null;
~~~

JVM tiếp tục dùng đầu vào hiện tại.

**Thay đổi**

~~~java
return transformedBytes;
~~~

Theo quy ước, transformer **nên** tạo một mảng byte mới chứa class file hợp lệ khi có thay đổi; điều bắt buộc là không được sửa trực tiếp classfileBuffer đầu vào.

**Không thể xử lý định dạng**

~~~java
throw new IllegalClassFormatException("...");
~~~

Điểm quan trọng là đầu ra không được “gần đúng”. JVM còn phải verify/link class sau chuỗi biến đổi; lỗi định dạng/phiên bản/liên kết có thể làm thao tác thất bại.

Công cụ bytecode nên nhận đầu vào, tạo model/visitor riêng rồi sinh mảng byte mới. Điều này cũng giúp transformer dễ thử lại/retransform hơn so với sửa tại chỗ.
