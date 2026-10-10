JDK cung cấp các cấu hình JFR phổ biến:

- **default.jfc**: tập event có chi phí thấp, phù hợp continuous recording;
- **profile.jfc**: thu nhiều dữ liệu hơn, phù hợp thời gian ngắn khi cần profiling sâu hơn.

`default.jfc` được thiết kế cho mức chi phí thấp và phù hợp với recording chạy liên tục. Với `JFR.start`, đừng phụ thuộc vào một impact label cố định giữa các JDK 21 update: Oracle Java 21 man page mô tả command là Low impact, trong khi một số JDK 21 update hiện tại (ví dụ 21.0.9) báo Medium vì cấu hình recording có thể dao động từ nhẹ đến nặng. Hãy dùng `jcmd <pid> help JFR.start` trên **JVM đích** làm contract thực tế. Chi phí cuối cùng vẫn phụ thuộc event, threshold, stack trace và workload.

Những lựa chọn cần cân nhắc:

- thời lượng: recording ngắn cho sự cố hay chạy liên tục;
- disk=true/false;
- `maxage` và `maxsize` để giới hạn dữ liệu giữ lại;
- threshold của event để tránh ghi mọi event quá nhỏ;
- có cần stack trace cho event đó không;
- chỉ bật việc thu thập đường tới GC roots khi thật sự điều tra leak vì thao tác này có thể gây pause/chi phí đáng kể. Với tên option, cần phân biệt version/tool surface: Oracle Java 21 `jcmd` man page ghi `path-to-gc-root` (singular), trong khi một số JDK 21 update hiện tại như 21.0.9 expose `path-to-gc-roots` (plural). Luôn kiểm tra `jcmd <pid> help JFR.start` trên JVM đích trước khi chạy.

Nguyên tắc: bắt đầu bằng bằng chứng có chi phí thấp từ cấu hình mặc định, sau đó mở rộng event hoặc dùng profile trong một khoảng ngắn nếu câu hỏi chưa được trả lời.
