# Lớp bọc, bộ đệm và hành vi đẩy dữ liệu (flush)

Các chương trước đã có các luồng đọc/ghi được dữ liệu. Bây giờ có hai câu hỏi thực tế: Java bổ sung hành vi cho một mô hình I/O đã có bằng cách nào, và vì sao nhiều thao tác I/O rất nhỏ thường cần bộ đệm? Câu trả lời chung là **ghép các lớp bọc (wrapper composition)**; đệm dữ liệu là một ứng dụng quan trọng của mô hình đó.
