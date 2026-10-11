Một phép biến đổi **idempotent** hướng tới kết quả ổn định khi gặp cùng một trạng thái đầu vào hợp lệ. Tuy nhiên cần hiểu đúng quy ước của retransformation: với transformer có canRetransform=true, JVM **không** đưa đầu ra của chính lần retransform trước của transformer đó trở lại làm đầu vào cho lần sau. JVM bắt đầu lại từ mốc bytes ban đầu/lần redefine gần nhất, tái áp dụng đầu ra của nhóm không hỗ trợ retransformation, rồi mới gọi lại transformer có hỗ trợ retransformation.

Vì vậy tình huống sau là **mô hình tư duy sai**:

~~~text
retransform #1 → probe A
retransform #2 → probe A + probe A
retransform #3 → probe A + probe A + probe A
~~~

Một transformer hỗ trợ retransformation đúng quy ước không tự tích lũy đầu ra cũ theo cách đó.

Rủi ro probe trùng vẫn có thể xuất hiện khi **mốc đầu vào đã chứa instrumentation** từ weaving lúc build, definition thay thế qua redefine, transformer không hỗ trợ retransformation, hoặc khi cùng logic bị đăng ký/chạy nhiều lần trong một chuỗi. Khi đó transformer cần nhận diện trạng thái đã được instrument thay vì chèn thêm mù quáng.

Các chiến lược:

- hiểu chính xác mốc cơ sở mà quy ước API cung cấp và các nhóm transformer;
- nhận diện marker/instruction/lời gọi helper do chính agent đã thêm;
- tạo phép biến đổi xác định từ cấu hình;
- tách “trạng thái instrumentation mong muốn” khỏi “bytes hiện tại”;
- kiểm thử nạp → retransform → retransform nhiều lần.

Tính idempotent đặc biệt quan trọng khi agent phải cùng tồn tại với instrumentation đã có, nhiều transformer hoặc cấu hình động. Nếu agent không biết bytes nào sẽ là đầu vào ở mỗi giai đoạn của chuỗi biến đổi, gần như không thể suy luận rollback một cách an toàn.
