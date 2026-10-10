### KHÁI NIỆM — hai cách tổ chức khác nhau ở đâu?

Lập trình theo thủ tục thường tổ chức chương trình quanh **các thao tác và luồng xử lý dữ liệu**. OOP thường tổ chức chương trình quanh **đối tượng và trách nhiệm**.

| Câu hỏi | Theo thủ tục | Theo OOP |
| --- | --- | --- |
| Đơn vị chính | Hàm / thủ tục | Đối tượng / trách nhiệm |
| Trạng thái | Thường được truyền qua các hàm | Thường do đối tượng sở hữu |
| Thay đổi thường được khoanh vùng theo | Luồng xử lý | Trách nhiệm / kiểu đối tượng |
| Phù hợp tự nhiên với | Thuật toán, pipeline, biến đổi dữ liệu tuyến tính | Miền có trạng thái, nhiều đối tượng cộng tác, hành vi thay đổi theo kiểu |

### VÌ SAO — OOP không phải lúc nào cũng tốt hơn

Một phép biến đổi dữ liệu ngắn hoặc một thuật toán thuần có thể rõ ràng hơn nếu viết thành hàm. Nếu ép mọi thứ thành một cây kế thừa gồm nhiều đối tượng, chương trình có thể trở nên rườm rà mà không nhận được lợi ích gì.

Ngược lại, khi bài toán có:

- trạng thái tồn tại lâu;
- nhiều quy tắc cần được bảo vệ;
- nhiều cách triển khai khác nhau;
- nhiều thành phần phải phối hợp với nhau;

thì việc chia trách nhiệm theo đối tượng thường giúp suy luận và thay đổi dễ hơn.

Java hỗ trợ cả hai phong cách. Một chương trình Java tốt hoàn toàn có thể dùng đối tượng để sở hữu trách nhiệm và dùng hàm hoặc lambda cho những phép biến đổi cục bộ.

### MINH CHỨNG — nên quan sát điều gì khi học OOP?

Đừng đánh giá một thiết kế OOP bằng số lượng class. Hãy xem một thay đổi có được khoanh vùng tốt hơn hay không.

Ví dụ, nếu thêm một cách tính giá mới mà `Checkout` không phải sửa, đó là minh chứng tốt hơn nhiều so với việc chỉ chứng minh rằng Java có từ khóa `interface`.

### THỰC HÀNH — câu hỏi xuyên suốt mô-đun

Khi học từng khái niệm tiếp theo, hãy luôn hỏi:

> “Khái niệm này đang giải quyết vấn đề nào vừa xuất hiện trong mô hình hiện tại?”

Chương tiếp theo bắt đầu từ vấn đề đầu tiên: **một đối tượng đã sở hữu trạng thái thì làm sao ngăn bên ngoài thay đổi trạng thái đó một cách tùy ý?**
