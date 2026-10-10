Sau toàn bộ mô-đun, có thể nhìn OOP như một dòng suy nghĩ liên tục:

```text
Đối tượng sở hữu trạng thái và trách nhiệm
        ↓
Đóng gói
giữ các thay đổi trạng thái hợp lệ
        ↓
Quan hệ kiểu con / Kế thừa
tạo quan hệ kiểu chung và kiểu cụ thể
        ↓
Đa hình
cho phép một hợp đồng có nhiều hành vi
        ↓
Ghi đè + Phân phối động
là cơ chế Java giúp hành vi của kiểu con được chọn lúc chạy
        ↓
Kết hợp đối tượng / Ủy quyền
cho phép thay đổi hành vi thông qua đối tượng cộng tác thay vì kéo dài cây kế thừa
        ↓
Trừu tượng hóa
giữ lại hợp đồng cần thiết và giảm chi tiết mà bên sử dụng phải biết
```

Nạp chồng (`Overloading`) xuất hiện trong mô-đun để phân biệt với ghi đè (`Overriding`), vì hai cơ chế này rất dễ bị nhầm. Nó **không phải một trụ cột OOP độc lập**.

### MÔ HÌNH RA QUYẾT ĐỊNH — kết hợp các công cụ OOP như thế nào?

Các khái niệm trong mô-đun không tạo thành một danh sách để áp dụng máy móc. Chúng trả lời những câu hỏi thiết kế khác nhau:

```text
Đối tượng có trạng thái cần tự bảo vệ không?
→ dùng đóng gói để kiểm soát các chuyển đổi trạng thái hợp lệ

Một kiểu có thật sự phải dùng được thay cho kiểu tổng quát hơn không?
→ cân nhắc quan hệ kiểu con và kế thừa

Bên gọi cần cùng một hợp đồng nhưng nhiều cách thực hiện khác nhau không?
→ dùng đa hình và khả năng thay thế

Mục tiêu chỉ là ghép hoặc thay đổi một phần hành vi mà không cần quan hệ kiểu con?
→ ưu tiên kết hợp đối tượng và ủy quyền

Bên sử dụng đang biết quá nhiều chi tiết triển khai không?
→ tạo một trừu tượng/hợp đồng ổn định ở đúng ranh giới
```

Kế thừa và kết hợp đối tượng không loại trừ nhau trong toàn bộ hệ thống. Một thiết kế có thể dùng kế thừa ở nơi thật sự có quan hệ kiểu con, đồng thời dùng kết hợp ở nơi các đối tượng chỉ cần cộng tác. Trừu tượng hóa có thể bao quanh cả hai để giữ bên sử dụng phụ thuộc vào hợp đồng thay vì chi tiết triển khai.

### ĐÁNH ĐỔI — khi nào không cần đẩy bài toán thành OOP phức tạp?

Nếu bài toán chỉ là một phép biến đổi dữ liệu ngắn, một thuật toán thuần hoặc một luồng xử lý tuyến tính không có trạng thái dài hạn, quy tắc bất biến hay nhiều biến thể cộng tác, việc thêm nhiều lớp, interface và tầng ủy quyền có thể chỉ làm tăng độ phức tạp.

Mục tiêu của OOP không phải là tạo nhiều đối tượng nhất có thể. Mục tiêu là tạo **ranh giới trách nhiệm giúp chương trình dễ hiểu và dễ thay đổi hơn**. Nếu một lớp trừu tượng, hệ phân cấp hoặc đối tượng cộng tác không tạo ra ranh giới hay điểm biến đổi có ý nghĩa, hãy xem lại liệu nó có thật sự cần thiết hay không.

### THỰC HÀNH — tiêu chí tự kiểm tra sau mô-đun

Khi nhìn một thiết kế OOP, đừng đếm số lượng class hoặc interface. Hãy thử trả lời năm câu hỏi:

1. mỗi trách nhiệm có nơi sở hữu rõ ràng không;
2. trạng thái và invariant có được đối tượng phù hợp bảo vệ không;
3. các kiểu con có thực sự thay thế được nhau theo hợp đồng không;
4. kế thừa và kết hợp đối tượng có được chọn vì đúng bản chất quan hệ không;
5. bên sử dụng có đang phụ thuộc vào những chi tiết triển khai không cần thiết không.

Nếu trả lời được năm câu hỏi này, bạn đã có một mô hình tư duy về OOP hữu ích hơn nhiều so với việc chỉ học thuộc lòng “bốn trụ cột”.
