Chẩn đoán trực tiếp (live diagnostics) phù hợp khi JVM vẫn đang chạy đủ ổn định để trả lời lệnh chẩn đoán. Khi tiến trình đã crash, bị kill, treo đến mức không thể attach an toàn hoặc phải restart để khôi phục dịch vụ, trọng tâm chuyển sang **postmortem diagnostics**: phân tích những dữ liệu chẩn đoán đã được bảo toàn tại thời điểm sự cố.

Khác biệt cốt lõi:

- chẩn đoán trực tiếp có thể hỏi JVM thêm thông tin ngay lúc điều tra;
- postmortem chỉ có thể suy luận từ trạng thái đã được ghi lại;
- vì vậy giá trị của postmortem phụ thuộc rất lớn vào việc chuẩn bị trước: core dump, fatal error log, heap dump khi OOME, GC log và JFR chạy liên tục.

Một lần restart có thể làm mất bằng chứng quan trọng. Trước khi restart một JVM đang có vấn đề, hãy cân nhắc thu thập thread dump, JFR dump, bằng chứng heap/native memory và log hiện tại nếu thao tác đó không làm tình trạng tệ hơn.

Postmortem không thay thế chẩn đoán trực tiếp; nó là bước tiếp theo khi trạng thái sống không còn hoặc không thể tin cậy.
