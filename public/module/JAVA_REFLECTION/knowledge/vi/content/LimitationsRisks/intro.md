# Khi nào nên dùng Reflection?

Reflection giải quyết một bài toán thật: mã có thể làm việc với cấu trúc chỉ được biết lúc chạy. Nhưng sự linh hoạt đó đến từ việc dời nhiều đảm bảo của trình biên dịch sang lúc chạy. Vì vậy câu hỏi thiết kế không phải “Reflection có làm được không?”, mà là “hành vi động này có đáng để trả chi phí về độ an toàn, sự phụ thuộc và vận hành không?”.

Các rủi ro trong chương này đều xuất phát từ cùng cách hiểu: mã Java trực tiếp tham chiếu kiểu/thành phần bằng ký hiệu mà trình biên dịch hiểu; mã dùng Reflection thường đi qua siêu dữ liệu, chuỗi, `Class`, `Method`, `Field` và `Object` rồi tự kiểm tra lúc chạy.
