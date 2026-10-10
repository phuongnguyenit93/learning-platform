Các phép toán public-key thường chậm hơn symmetric operations và có giới hạn kích thước đầu vào theo scheme/key size. Ví dụ RSA encryption không được dùng như stream cipher để encrypt file lớn từng chunk theo cách tùy ý.

Padding/encoding scheme cũng là phần bắt buộc của security. “RSA” không đủ để mô tả một protocol an toàn; transformation/scheme phải được specification quy định.

Asymmetric crypto vì thế thường dùng để bảo vệ **small secret material** hoặc thực hiện key establishment, còn payload lớn được bảo vệ bằng symmetric AEAD.

Đây là lý do hybrid encryption phổ biến: mỗi primitive làm phần việc nó phù hợp nhất.
