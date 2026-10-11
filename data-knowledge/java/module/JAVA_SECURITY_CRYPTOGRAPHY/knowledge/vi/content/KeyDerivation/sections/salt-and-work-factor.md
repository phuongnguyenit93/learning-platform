**Salt** không cần bí mật. Nó cần đủ tính unique/ngẫu nhiên để cùng một password ở hai record không tạo cùng kết quả dẫn xuất và để phá precomputed lookup dùng chung.

**Work factor** làm mỗi lần thử password đắt hơn. Với PBKDF2, iteration count là một phần của parameter set. Giá trị “an toàn” không phải hằng số vĩnh viễn; phần cứng và chính sách thay đổi, nên hệ thống thực tế cần hiệu chỉnh và version hóa parameters.

Một record thường phải lưu cùng:

~~~text
KDF id/version
salt
work factor / parameters
derived verifier hoặc encrypted payload
~~~

Không tái sử dụng một fixed salt toàn cục chỉ vì dễ cấu hình. Không tăng work factor đến mức service tự gây DoS; tham số bảo mật cũng là bài toán hoạch định năng lực.
