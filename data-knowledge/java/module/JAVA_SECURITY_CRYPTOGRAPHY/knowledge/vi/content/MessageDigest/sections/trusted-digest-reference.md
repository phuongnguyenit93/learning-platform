Digest chỉ phát hiện thay đổi có ý nghĩa khi bên kiểm tra có **reference đáng tin cậy**.

Ví dụ package repository công bố SHA-256 qua một kênh đã được xác thực. Client tải file từ mirror và so digest của file với giá trị tham chiếu đó. Nếu kẻ tấn công chỉ sửa được file, mismatch bị phát hiện.

Nhưng nếu kẻ tấn công sửa được cả file và giá trị digest tham chiếu:

~~~text
modified file
    +
digest(modified file)
~~~

thì comparison vẫn pass. Vì vậy digest không tạo authenticity từ con số 0.

Khi so hai digest trong security-sensitive code, MessageDigest.isEqual(...) cung cấp API comparison dành cho digest bytes thay vì tự viết vòng lặp dừng ngay khi gặp byte khác.
