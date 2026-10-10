Không nên biến Annotation thành nơi chứa:

- logic nghiệp vụ phức tạp;
- dữ liệu thay đổi liên tục ở thời gian chạy;
- dữ liệu bí mật;
- cấu hình lớn phụ thuộc môi trường;
- dữ liệu cần thay đổi thường xuyên mà không muốn biên dịch lại ứng dụng;
- đồ thị đối tượng động.

Nếu một thông tin phù hợp hơn với đối tượng, cơ sở dữ liệu hoặc tệp cấu hình thì nên dùng đúng công cụ đó.

Một cách chọn đơn giản:

| Nhu cầu | Cơ chế thường rõ ràng hơn |
| --- | --- |
| Gắn thông tin khai báo nhỏ, ổn định vào mã nguồn | Annotation |
| Muốn ép một type cung cấp hành vi cụ thể | `interface` / abstract type |
| Muốn bên gọi chủ động gọi một thao tác | Method/API tường minh |
| Dữ liệu thay đổi theo môi trường triển khai | Tệp cấu hình / biến môi trường / đối tượng cấu hình |
| Dữ liệu thay đổi thường xuyên lúc chạy | Đối tượng / cơ sở dữ liệu / dịch vụ |
| Cần lưu dữ liệu bí mật | Kho lưu trữ bí mật / cơ chế cấu hình bảo mật |

Ví dụ, nếu mục tiêu là bắt một dịch vụ phải có method `audit()`, một `interface` có thể rõ ràng hơn một marker Annotation vì trình biên dịch kiểm tra trực tiếp quy tắc hành vi.

Ngược lại, nếu mục tiêu chỉ là nói **“method này cần được hệ thống audit quan sát”**, Annotation có thể phù hợp hơn vì thông tin đó là siêu dữ liệu về method, không phải method mà đối tượng bắt buộc phải tự triển khai.
