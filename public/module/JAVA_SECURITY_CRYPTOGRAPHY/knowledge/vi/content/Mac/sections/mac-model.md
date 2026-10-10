Message Authentication Code (MAC) thêm **secret key** vào bài toán integrity/authenticity. Bên nhận chỉ chấp nhận tag nếu tag được tạo từ message và shared secret phù hợp.

~~~text
message + shared secret
       ↓ MAC
authentication tag
~~~

Nếu kẻ tấn công sửa thông điệp nhưng không biết secret, họ không thể thực tế tạo tag hợp lệ mới theo các giả định bảo mật của thuật toán.

Điểm khác với digest là reference không cần được giữ ở kênh riêng: authenticity được gắn vào shared secret. Điểm khác với signature là mọi bên biết secret đều có thể tạo MAC, nên MAC không phân biệt “ai trong nhóm secret holders” đã tạo message.
