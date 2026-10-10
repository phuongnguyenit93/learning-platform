Hàm thuần túy, tính trong suốt tham chiếu, tính bất biến như nguyên tắc thiết kế chung và các đánh đổi không phụ thuộc ngôn ngữ thuộc mô-đun Mô hình lập trình hàm.

Ở Java Core, ranh giới cần nhớ đơn giản hơn: **cú pháp lambda không đảm bảo tính thuần túy hay bất biến**. Lambda Java có thể đọc trường có thể thay đổi, thay đổi đối tượng được bắt giữ, thực hiện I/O hoặc gọi phương thức có tác dụng phụ. Ngược lại, một phương thức Java có tên bình thường vẫn có thể là hàm thuần túy dù không dùng lambda.

Khi đọc mã, cần tách hai lớp kiến thức đó. Các cơ chế trong mô-đun này giúp hành vi có thể được truyền và kết hợp như giá trị; chúng không tự động mang lại các thuộc tính ngữ nghĩa thuộc mô hình lập trình hàm.
