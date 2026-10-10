**Dẫn xuất khóa (key derivation)** biến vật liệu đầu vào thành vật liệu khóa có đặc tính phù hợp cho một mục đích cụ thể.

Đầu vào có thể là password hoặc secret material từ protocol. Chapter này tập trung vào password-based derivation vì đó là phạm vi đã chốt trong Curriculum.

Password thường có entropy thấp và phân bố không đều. Dùng trực tiếp password bytes làm AES/HMAC key khiến kẻ tấn công thử các phương án password với chi phí quá thấp.

Cơ chế KDF/PBE thêm salt và chi phí tính toán để mỗi lần thử password trở nên đắt hơn, đồng thời hạn chế việc tái sử dụng bảng precomputation giữa nhiều record.
