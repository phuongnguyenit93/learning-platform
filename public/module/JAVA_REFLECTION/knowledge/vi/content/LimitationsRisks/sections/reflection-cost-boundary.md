Tính linh hoạt của Reflection đến từ việc dời một số quyết định từ thời điểm biên dịch sang lúc chạy. Vì vậy cái giá đầu tiên là **mất một phần kiểm tra tĩnh**.

~~~java
// Trình biên dịch kiểm tra được
service.pay(request);

// Sai tên chỉ lộ ra khi chạy
service.getClass().getMethod("proccess", PaymentRequest.class);
~~~

Ngoài lỗi tên, code dùng Reflection còn phải xử lý thành phần không tồn tại, sai đối tượng nhận, sai đối số, quyền truy cập bị từ chối và ngoại lệ do chính mã đích ném ra. Các chương trước đã lần lượt minh họa những nhóm lỗi này; chương cuối gom chúng lại để phục vụ quyết định thiết kế.

Cái giá thứ hai là **sự phụ thuộc ẩn**. IDE dễ tìm tham chiếu của `service.pay(...)`, nhưng khó biết một chuỗi `"pay"` trong cấu hình hay framework có đang phụ thuộc vào tên method đó hay không. Đổi tên/tái cấu trúc vì thế cần hợp đồng và test tốt hơn.

Cái giá thứ ba là tính đóng gói. Reflection vẫn chịu kiểm tra truy cập; một số API có thể yêu cầu thay đổi khả năng truy cập phản chiếu, và JPMS tạo thêm ranh giới đóng gói mạnh. Đây là nội dung của chương **Quyền truy cập, đóng gói và giới hạn mô-đun**. “Có Reflection” không đồng nghĩa “private không còn ý nghĩa”.

Cái giá thứ tư là chi phí lúc chạy. Việc tra cứu siêu dữ liệu và thao tác qua `Method.invoke()`/`Field` thường đắt hơn lời gọi trực tiếp, dù JVM và framework có nhiều kỹ thuật lưu đệm/tối ưu. Điều này hiếm khi là lý do để né Reflection ở bước khởi động vài lần, nhưng đáng chú ý nếu việc tra cứu/gọi nằm trên đường chạy nóng. Các phần bên dưới sẽ phân tích chi tiết hơn.

Một quy tắc thực dụng:

~~~text
Biết kiểu/thành phần tại thời điểm biên dịch
→ ưu tiên lời gọi trực tiếp, interface, đa hình hoặc factory

Cấu trúc thật sự chỉ biết lúc chạy
và việc khám phá nó là yêu cầu
→ Reflection có thể phù hợp
~~~

Khi dùng Reflection, nên thu hẹp vùng động: kiểm tra siêu dữ liệu sớm, lưu đệm đối tượng mô tả nếu dùng lặp lại, chuyển lỗi lúc chạy thành lỗi miền/framework dễ hiểu, và giữ phần mã nghiệp vụ bên ngoài càng an toàn kiểu càng tốt.

Phần tổng quan này đặt các đánh đổi vào cùng một khung. Các phần tiếp theo sẽ tách riêng độ an toàn lúc biên dịch, tính đóng gói, hiệu năng, native image và khả năng bảo trì trước khi đi tới mô hình quyết định cuối cùng.
