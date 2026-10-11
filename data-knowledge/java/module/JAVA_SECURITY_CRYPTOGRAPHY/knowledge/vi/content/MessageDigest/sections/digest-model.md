`MessageDigest` biểu diễn hàm băm mật mã. Dữ liệu đầu vào có thể dài tùy ý; đầu ra là digest có kích thước do thuật toán quyết định.

Mental model:

~~~text
bytes
  ↓ hash
fixed-size digest
~~~

Digest **không có key**. Vì vậy hai bên có cùng dữ liệu đầu vào và thuật toán đều có thể tạo cùng digest. Điều này rất hữu ích cho fingerprint và so sánh, nhưng cũng là lý do digest thuần không chứng minh danh tính bên gửi.

Một hash function an toàn cho use case cụ thể cần các property như khó tìm preimage và collision ở mức chấp nhận được. Không nên suy “có chữ SHA” là đủ; chính sách thuật toán thay đổi theo thời gian, và một số algorithm cũ có thể bị JDK/chính sách bảo mật hạn chế.
