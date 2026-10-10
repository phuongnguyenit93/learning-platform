Chẩn đoán thread trả lời câu hỏi **“các luồng đang làm gì và vì sao công việc không tiến triển?”**. Nó hữu ích khi ứng dụng treo, request chậm, CPU cao, thread pool cạn, nghi ngờ deadlock hoặc nhiều thread cùng chờ một tài nguyên.

Một thread dump không phải lịch sử thực thi. Nó là ảnh chụp tại một thời điểm của:

- định danh thread;
- trạng thái Java;
- stack trace;
- thông tin monitor/lock khi công cụ hỗ trợ;
- đôi khi có phần tóm tắt deadlock.

Vì vậy chẩn đoán thread mạnh nhất khi dùng để **hình thành và kiểm tra giả thuyết**, không phải kết luận từ một ảnh chụp trạng thái.

Ranh giới quan trọng: module này đọc bằng chứng về thread. Ngữ nghĩa sâu của `synchronized`, `Lock`, happens-before và tính đúng đắn concurrency thuộc Java Concurrency.
