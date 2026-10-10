Đến cuối module, câu hỏi quan trọng không còn là “class nào tồn tại?” mà là **abstraction nào khớp với bài toán giao tiếp hiện tại?**

Một mô hình quyết định hữu ích gồm năm chiều:

1. **Data semantics** — byte stream, datagram, request/response hay message-oriented connection?
2. **Peer relationship** — một connection lâu sống hay nhiều interaction độc lập?
3. **Concurrency model** — blocking thread-per-task, selector readiness hay asynchronous completion?
4. **Control level** — cần tự quản lý framing/socket option hay muốn API mức cao xử lý protocol?
5. **Vòng đời/lỗi** — ai sở hữu timeout, cancellation, close và retry policy?

~~~text
bài toán
 ↓
ngữ nghĩa giao tiếp
 ↓
mức kiểm soát cần thiết
 ↓
ràng buộc concurrency/vòng đời
 ↓
abstraction JDK nhỏ nhất vẫn đáp ứng yêu cầu
~~~

“API thấp hơn” không tự động nhanh hơn, và “API cao hơn” không tự động đơn giản trong mọi trường hợp. Mục tiêu là chọn **mức abstraction thấp nhất cần thiết, nhưng không thấp hơn**.

Ví dụ, nếu bài toán chỉ là gọi một HTTP endpoint, tự mở Socket rồi viết HTTP framing tạo ra độ phức tạp không cần thiết. Ngược lại, nếu đang xây custom binary protocol trên TCP, HttpClient không phải abstraction phù hợp.
