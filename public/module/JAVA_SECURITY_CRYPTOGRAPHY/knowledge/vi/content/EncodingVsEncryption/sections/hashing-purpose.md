Hàm băm mật mã nhận dữ liệu đầu vào có độ dài bất kỳ và tạo digest có kích thước cố định. Ý tưởng sử dụng chính là: cùng dữ liệu đầu vào tạo cùng digest, trong khi việc tìm dữ liệu khác cho cùng digest hoặc đảo ngược digest phải khó theo các đặc tính bảo mật của thuật toán.

Hash phù hợp để tạo fingerprint, kiểm tra file với giá trị tham chiếu đáng tin cậy hoặc làm thành phần bên trong nhiều primitive khác. Hash **không dùng key**, nên nếu kẻ tấn công có thể sửa cả dữ liệu lẫn digest thì họ cũng có thể hash lại dữ liệu mới.

Do đó hash thuần không phải cơ chế authentication. Password cũng không nên chỉ được hash một lần bằng MessageDigest; password storage cần cơ chế dẫn xuất khóa/password hashing có salt và work factor phù hợp, được học ở chapter Key Derivation.
