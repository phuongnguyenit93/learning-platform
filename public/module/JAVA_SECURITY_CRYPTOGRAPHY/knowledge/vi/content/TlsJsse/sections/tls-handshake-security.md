TLS handshake thiết lập security context trước khi dữ liệu ứng dụng được bảo vệ. Ở mức mô hình tư duy, handshake cần:

- thỏa thuận protocol/cipher capabilities;
- xác thực peer theo chế độ đã cấu hình;
- thực hiện key establishment;
- dẫn xuất session traffic keys;
- xác nhận hai phía có transcript/state nhất quán.

Sau đó record layer dùng bảo vệ symmetric có xác thực cho lưu lượng.

Ứng dụng không nên tự lấy “TLS key” ra rồi tái sử dụng cho mục đích khác. TLS protocol sở hữu key schedule và context binding.

Lỗi handshake thường là tín hiệu về bảo mật hoặc cấu hình: certificate không được tin cậy, hostname sai, algorithm bị vô hiệu hóa, protocol không tương thích hoặc key material không phù hợp.
