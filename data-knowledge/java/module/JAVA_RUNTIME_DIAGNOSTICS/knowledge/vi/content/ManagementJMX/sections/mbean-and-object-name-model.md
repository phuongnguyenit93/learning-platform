**MBean** là object cung cấp một interface quản lý qua JMX. **MXBean** là một dạng MBean có quy tắc ánh xạ type sang các “open types” chuẩn, giúp client từ xa không cần các class riêng của ứng dụng.

Mỗi managed bean đăng ký trong MBeanServer được nhận diện bằng **ObjectName**, ví dụ conceptual:

~~~text
java.lang:type=Memory
java.lang:type=Threading
java.lang:type=GarbageCollector,name=<collector>
~~~

`ObjectName` có domain + key properties. Nó là định danh quản lý, không phải Java object reference.

Tại sao điều này quan trọng cho diagnostics?

- client có thể query bean theo tên/pattern;
- attribute/thao tác quản lý được cung cấp có cấu trúc;
- client local và remote dùng cùng mô hình quản lý;
- platform MXBeans đã có ObjectName chuẩn.

Không cần học toàn bộ mô hình instrumentation của JMX để dùng platform MXBeans, nhưng hiểu MBean/ObjectName giúp đọc JConsole và remote JMX đúng cách.
