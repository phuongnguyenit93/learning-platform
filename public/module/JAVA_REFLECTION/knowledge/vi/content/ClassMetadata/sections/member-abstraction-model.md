Trước khi tách riêng `Field`, `Method` và `Constructor`, cần hiểu chúng không phải ba API hoàn toàn độc lập. Java Reflection cung cấp một số khái niệm trừu tượng chung để framework có thể xử lý thành phần ở mức cao hơn:

| Khái niệm | Vai trò |
| --- | --- |
| `Member` | Hợp đồng chung cho `Field`, `Method`, `Constructor`: tên, class khai báo, modifier, trạng thái synthetic |
| `Executable` | Class nền tảng chung của `Method` và `Constructor`: tham số, ngoại lệ, varargs, khai báo generic |
| `AccessibleObject` | Class nền tảng chung của `Field`, `Method`, `Constructor` cho kiểm tra quyền truy cập phản chiếu |
| `AnnotatedElement` | Hợp đồng đọc annotation lúc chạy; được triển khai bởi `AccessibleObject` và nhiều phần tử khác |

~~~text
                 Member
             ┌─────┴──────┐
           Field       Executable
                         ├─ Method
                         └─ Constructor

Field ───────────────┐
Executable ──────────┴─→ AccessibleObject → AnnotatedElement
~~~

Đây là bản đồ học tập, không phải toàn bộ hệ phân cấp kiểu của `java.lang.reflect`. Ví dụ `Executable` còn triển khai `GenericDeclaration`; `Class<?>` cũng triển khai `AnnotatedElement` nhưng không phải `Member`.

Mô hình tư duy thực hành là:

~~~text
khám phá
→ lấy đối tượng mô tả
→ đọc siêu dữ liệu chung
→ kiểm tra quyền truy cập
→ thực hiện thao tác riêng của Field / Method / Constructor
~~~

Nhờ vậy ba chương tiếp theo có thể tập trung vào hành vi riêng mà không phải học lại modifier, annotation hay abstraction truy cập từ đầu cho từng loại thành phần.
