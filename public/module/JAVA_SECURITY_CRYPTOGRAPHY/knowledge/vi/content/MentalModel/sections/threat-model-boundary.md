Trước khi chọn primitive, cần hỏi **kẻ tấn công có thể làm gì**. Nếu kẻ tấn công chỉ có thể đọc bản sao database, mục tiêu chính có thể là confidentiality của dữ liệu lưu trữ. Nếu kẻ tấn công có thể sửa thông điệp trên đường truyền, integrity và authenticity cũng trở thành yêu cầu. Nếu endpoint đã bị chiếm quyền và kẻ tấn công đọc được key trong process, mã hóa dữ liệu ngay trong process không thể khôi phục ranh giới tin cậy đã mất.

Mô hình đe dọa (threat model) tối thiểu nên trả lời:

1. dữ liệu nào cần bảo vệ;
2. dữ liệu ở đâu: memory, file, database hay network;
3. ai được phép đọc hoặc tạo dữ liệu;
4. kẻ tấn công có thể đọc, sửa, replay hay giả mạo đến mức nào;
5. key/certificate nào được xem là trust anchor.

Ranh giới của module cũng cần rõ. Cơ chế Socket, DNS và HTTP thuộc Networking. Quy trình cấp phát CA, vận hành HSM, xoay vòng secret và IAM là trách nhiệm hạ tầng. Ở đây chỉ học đủ để mã Java sử dụng key, certificate và trust material đúng hợp đồng bảo mật.
