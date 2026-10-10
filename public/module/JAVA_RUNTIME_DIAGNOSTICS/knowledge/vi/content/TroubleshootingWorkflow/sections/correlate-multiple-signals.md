Một tín hiệu hiếm khi đủ để kết luận nguyên nhân gốc. Hãy đối chiếu theo **cùng PID, cùng khoảng thời gian và cùng giả thuyết**.

Ví dụ CPU cao:

- metric OS/container xác nhận CPU thật sự cao;
- repeated thread dumps cho thấy stack nào lặp lại;
- JFR CPU samples cho biết code path chiếm sample;
- GC events loại trừ việc CPU chủ yếu đến từ GC;
- dòng thời gian deploy/log chỉ ra thay đổi nào xảy ra trước spike.

Ví dụ bộ nhớ:

- RSS của tiến trình tăng;
- heap usage/GC xác định heap có phải nguồn tăng không;
- histogram/heap dump xem object population;
- NMT kiểm tra JVM-native categories;
- bằng chứng allocation/old-object từ JFR hỗ trợ xác định nguồn.

Đối chiếu dữ liệu không phải ghép mọi thứ vào một dashboard. Mục tiêu là kiểm tra xem nhiều nguồn độc lập có phù hợp với cùng một chuỗi nguyên nhân hay không.
