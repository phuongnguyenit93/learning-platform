Điểm khác biệt lớn nhất giữa lỗi Java thuần và lỗi native là **mức độ nghiêm trọng của lỗi**. NullPointerException thường giữ JVM sống; native memory corruption có thể phá hỏng process trước khi Java có cơ hội ném exception.

Nguyên nhân thường gặp:

- gọi function pointer với sai descriptor;
- native code ghi vượt buffer;
- dereference pointer đã hết lifetime;
- callback stub đã được giải phóng;
- ABI/layout mismatch;
- bug trong chính native library.

Silent memory corruption còn nguy hiểm hơn crash vì triệu chứng có thể xuất hiện rất lâu sau thao tác gây lỗi.

Phòng ngừa tốt hơn “catch exception”: thu hẹp native boundary, dùng spatial/temporal checks của FFM, validate descriptor/layout, giữ ownership rõ và test bằng native sanitizer/debugger khi cần. Không có try/catch Java nào có thể biến mọi undefined native behavior thành recoverable error.

Khi các failure boundary này đã rõ, chương cuối biến chúng thành tiêu chí thiết kế: khi nào chọn JNI, FFM, wrapper có sẵn hoặc không dùng native boundary, và cách review toàn bộ integration end-to-end.
