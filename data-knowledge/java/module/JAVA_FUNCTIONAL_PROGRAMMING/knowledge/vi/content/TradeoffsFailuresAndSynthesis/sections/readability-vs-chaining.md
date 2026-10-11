API kiểu hàm khiến việc nối nhiều thao tác trở nên dễ dàng, nhưng một chuỗi chỉ dễ đọc khi người đọc vẫn theo được hình dạng dữ liệu, cách lỗi xảy ra và mục đích của từng bước.

Một số dấu hiệu nên dừng và tách chuỗi:

- nhiều trách nhiệm không liên quan bị đặt trong cùng một chuỗi;
- lambda lồng nhau khiến khó theo dõi biến nào là biến nào;
- liên tục chuyển đổi lớp bọc chỉ để giữ được cách viết chuỗi lời gọi;
- tác dụng phụ nằm trong thao tác trông giống phép biến đổi;
- tên các bước không thể hiện ý nghĩa nghiệp vụ.

Hãy tách thành phương thức có tên, thêm biến trung gian hoặc dùng luồng điều khiển thông thường nếu điều đó làm logic dễ kiểm tra hơn. Ít dòng hơn không tự động có nghĩa là mã đơn giản hơn.
