ClassLoader/khả năng nhìn thấy qua module là nguồn lỗi rất phổ biến trong môi trường production.

Ví dụ class mục tiêu:

~~~text
class plugin
được định nghĩa bởi PluginClassLoader
trong named module plugin.foo
~~~

bytecode đã biến đổi gọi:

~~~text
AgentRuntime.record()
~~~

Nếu AgentRuntime chỉ nhìn thấy từ system loader, class do PluginClassLoader định nghĩa có thể không phân giải được helper.

Giải pháp tùy kiến trúc:

- bootstrap helper tối thiểu;
- chèn helper vào loader của class mục tiêu;
- thêm JAR vào đường tìm kiếm của loader phù hợp;
- dùng redefineModule để thêm read/open/export cần thiết.

Không nên “sửa” bằng cách thêm toàn bộ agent JAR vào đường tìm kiếm bootstrap. Tài liệu API cảnh báo JAR trên đường tìm kiếm bootstrap chỉ nên chứa class/tài nguyên cần được bootstrap loader định nghĩa; xung đột package có thể gây IllegalAccessError và lỗi khó chẩn đoán.
