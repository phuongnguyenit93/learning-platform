Một sự cố hiếm khi được giải thích bởi một nguồn dữ liệu duy nhất. Trước khi restart, hãy bảo toàn các nguồn dữ liệu có thể biến mất:

- log ứng dụng và JVM/GC log trong đúng khoảng thời gian;
- continuous JFR hoặc một JFR dump vừa thu;
- thread dump nếu tiến trình còn phản hồi;
- heap dump hoặc histogram khi bài toán liên quan bộ nhớ;
- NMT summary/diff nếu NMT đã được bật;
- fatal error log và core dump nếu có crash;
- command line, environment/version và thời điểm deploy gần nhất.

Oracle khuyến nghị chuẩn bị Java cho troubleshooting từ trước: bật core file khi phù hợp, HeapDumpOnOutOfMemoryError, continuous Flight Recording, GC logging và remote management theo policy.

Nguyên tắc thực tế là **bảo toàn bằng chứng trước, restart sau** nếu SLA cho phép. Restart có thể phục hồi dịch vụ nhưng đồng thời xóa trạng thái thread, JFR buffer, bộ nhớ tiến trình và nhiều dấu hiệu tạm thời.

Dữ liệu chẩn đoán cũng là dữ liệu trên production cần được bảo vệ. Heap/core dump có thể chứa credentials, request payload, PII hoặc key material; quyền truy cập và chính sách giữ dữ liệu phải chặt hơn log thông thường.
