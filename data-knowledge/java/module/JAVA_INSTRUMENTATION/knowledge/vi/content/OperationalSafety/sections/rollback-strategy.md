Rollback không đồng nghĩa removeTransformer.

Muốn bỏ phần instrumentation khỏi class đã biến đổi, agent cần một chiến lược:

~~~text
vô hiệu hóa hành vi transformer
→ gỡ đăng ký nếu phù hợp
→ xác định các class bị ảnh hưởng
→ retransform/redefine về dạng không còn instrumentation mong muốn
→ xác minh kết quả
~~~

Với transformer hỗ trợ retransformation, một chiến lược phổ biến là đổi cấu hình thành “không chèn instrumentation” rồi retransform class mục tiêu. Nhưng phải hiểu các phép biến đổi từ transformer không hỗ trợ retransformation trước đó vẫn được JVM tự áp dụng lại.

Với redefine, agent có thể giữ/khôi phục bộ bytes mốc cơ sở đã biết, nhưng việc quản lý mốc cơ sở phức tạp khi có nhiều agent hoặc class đã redefine trước đó.

Rollback phải được kiểm thử như một tính năng riêng:

- stack frame đang hoạt động chuyển tiếp thế nào;
- tính nguyên tử của từng lời gọi theo nhóm: nếu một lời gọi redefineClasses/retransformClasses ném exception thì không class nào trong chính tập truyền vào lời gọi đó được thay đổi;
- tiến độ một phần ở quy trình nhiều nhóm/lời gọi: các nhóm trước có thể đã thành công trước khi nhóm sau thất bại;
- helper còn có thể được nhìn thấy sau rollback;
- dọn trạng thái telemetry;
- nhiều agent cùng sửa class.
