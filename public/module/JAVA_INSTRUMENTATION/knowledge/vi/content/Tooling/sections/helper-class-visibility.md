Một phép biến đổi thường chèn lời gọi tới helper:

~~~text
OrderService.placeOrder()
→ AgentRuntime.onEnter()
→ AgentRuntime.onExit()
~~~

Nhưng class mục tiêu chỉ gọi được helper nếu helper có thể được nhìn thấy và liên kết từ defining loader/module của class đó.

Các chiến lược thường gặp:

- bootstrap helper JAR qua appendToBootstrapClassLoaderSearch;
- helper trên system loader hoặc application loader khi phù hợp;
- auxiliary class được chèn theo loader;
- redefineModule để mở reads/opens/exports cần thiết.

Bẫy điển hình là cùng tên Helper nhưng được hai ClassLoader định nghĩa → identity kiểu khác nhau.

Vì vậy “bytecode đã chèn INVOKESTATIC đúng” chưa đủ; phải hỏi:

~~~text
class mục tiêu sẽ phân giải helper bằng loader nào?
module có read/open/export phù hợp không?
dependency của helper có thể được nhìn thấy không?
~~~
