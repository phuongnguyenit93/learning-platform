Khi chọn cơ chế, nên bắt đầu từ contract thật của native side thay vì sở thích API.

Các câu hỏi hữu ích:

1. Native surface là C function đơn giản hay tích hợp sâu với Java object/class?
2. Đã có JNI wrapper được kiểm thử và bảo trì chưa?
3. Baseline JDK có chấp nhận FFM preview của Java 21 không?
4. Callback, pointer và vòng đời tài nguyên phức tạp đến mức nào?
5. Cần hỗ trợ những OS/architecture nào?
6. Đội ngũ có khả năng gỡ lỗi native crash, ABI mismatch và xử lý đóng gói không?

Một binding tốt cũng nên có Java-facing API nhỏ, không để consumer phải biết JNIEnv, raw symbol name hay lifetime detail nếu không cần.
