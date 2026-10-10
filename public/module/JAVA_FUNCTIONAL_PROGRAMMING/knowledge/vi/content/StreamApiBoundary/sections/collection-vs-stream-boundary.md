`Collection` trước hết là cấu trúc dữ liệu sở hữu hoặc cho phép truy cập các phần tử. `Stream` là khái niệm trừu tượng do API cung cấp để mô tả việc xử lý trên một nguồn phần tử; nó không đơn giản là một loại tập hợp khác.

Từ góc nhìn lập trình hàm trong Java, điểm cần giữ là Stream cho phép tham số hóa quá trình xử lý bằng hành vi. Nguồn dữ liệu có thể đến từ tập hợp, nhưng `Predicate`, `Function` hoặc `Consumer` được truyền vào vẫn là những giá trị giao diện hàm đã học trong mô-đun này.

Các câu hỏi như khi nào phần tử được xử lý, các thao tác được phân loại ra sao hoặc kết quả được gom như thế nào đều cần quy tắc riêng của Stream và nên học ở mô-đun chuyên biệt.
