Class-file bytes kết quả phải thỏa định dạng class file của JVM và các ràng buộc của thao tác hiện tại.

Một công cụ bytecode thường giúp tính:

- entry của constant pool;
- cách mã hóa instruction;
- offset của nhánh;
- bảng exception;
- stack-map frame;
- attribute.

Nhưng agent vẫn chịu trách nhiệm về ngữ nghĩa. Ví dụ công cụ có thể tạo method gọi Helper.record(), nhưng nếu Helper không thể được nhìn thấy từ defining loader/module của class mục tiêu, verification/linkage có thể thất bại dù bytes “đúng định dạng”.

Việc xác minh nên có nhiều tầng:

~~~text
công cụ phân tích/tạo bytes
→ kiểm thử verification/nạp class độc lập
→ kiểm thử tích hợp agent
→ kiểm thử nhanh trên ứng dụng mục tiêu
→ kiểm thử tương thích multi-agent / JDK mục tiêu
~~~

“Thư viện bytecode không ném lỗi” chỉ là tầng đầu.
