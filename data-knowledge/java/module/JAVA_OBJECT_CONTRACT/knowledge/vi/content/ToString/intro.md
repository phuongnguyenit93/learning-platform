# Biểu diễn văn bản với toString

Không phải quy ước nào của Object cũng phục vụ cấu trúc dữ liệu. `toString` chủ yếu phục vụ **con người và công cụ chẩn đoán**: log, trình gỡ lỗi, thông báo lỗi của phép kiểm tra (`assertion`) hoặc kiểm thử, và văn bản hiển thị tạm thời.

Một `toString` tốt giúp ta trả lời nhanh câu hỏi: **đối tượng này đang mang trạng thái gì đáng chú ý?** Nó không nên biến thành giao thức tuần tự hóa dữ liệu, ranh giới bảo mật hoặc nơi thực hiện xử lý nặng.
