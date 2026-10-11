Kiểm thử tương thích cần nhiều chiều:

~~~text
JDK runtime
× phiên bản ứng dụng/framework
× phiên bản class file
× phiên bản công cụ bytecode
× cấu hình agent
× khả năng cùng tồn tại với agent khác
~~~

Kiểm thử tối thiểu nên có:

- startup agent;
- dynamic attach nếu hỗ trợ;
- class mục tiêu được nạp trước/sau agent;
- retransform nhiều lần;
- bật/tắt/rollback;
- nhiều class loader;
- named module;
- class không được hỗ trợ hoặc không thể sửa đổi;
- đường thoát bằng exception trong method đã biến đổi;
- thứ tự nhiều agent.

Agent production nên công bố thông tin tự chẩn đoán:

- phiên bản agent;
- các instrumentation đang bật;
- số lần transform thành công/thất bại;
- số class không được hỗ trợ đã bỏ qua;
- phiên bản JDK/công cụ hiện tại.

Agent càng “vô hình” với ứng dụng thì khả năng tự chẩn đoán càng quan trọng khi có lỗi.
