`Thread.State` là nhóm thuật ngữ nền đầu tiên để đọc dump:

- **RUNNABLE**: đang thực thi hoặc runnable theo JVM; không đồng nghĩa chắc chắn đang dùng CPU;
- **BLOCKED**: chờ monitor để vào synchronized block/method;
- **WAITING**: chờ vô thời hạn qua cơ chế như Object.wait, Thread.join hoặc park;
- **TIMED_WAITING**: chờ có timeout;
- NEW/TERMINATED thường ít xuất hiện trong dump live thông thường.

Stack trace cho biết chuỗi lời gọi hiện tại. Khi nhiều thread có cùng stack, hãy hỏi đó là **điểm chờ mong đợi** hay nút thắt.

Ví dụ một consumer thread ở trạng thái WAITING trong thao tác lấy dữ liệu từ queue có thể hoàn toàn bình thường khi không có công việc. Ngược lại, hàng trăm thread xử lý request cùng BLOCKED trên một lock của ứng dụng qua nhiều ảnh chụp là bằng chứng mạnh hơn về contention.

Không gán trạng thái → vấn đề một cách máy móc. Trạng thái phải được đọc cùng workload, stack và yếu tố thời gian.
