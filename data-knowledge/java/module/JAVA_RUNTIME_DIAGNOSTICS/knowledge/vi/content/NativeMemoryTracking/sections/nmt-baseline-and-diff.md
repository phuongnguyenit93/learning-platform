Giá trị lớn nhất của NMT thường nằm ở **xu hướng**, không phải một summary đơn lẻ.

Tạo baseline tại điểm phù hợp với câu hỏi điều tra:

~~~text
jcmd <pid> VM.native_memory baseline
~~~

Sau đó:

~~~text
jcmd <pid> VM.native_memory summary.diff
jcmd <pid> VM.native_memory detail.diff
~~~

Diff cho biết category/call-site nào thay đổi so với baseline. Với bài toán tăng trưởng ở trạng thái ổn định, quy trình hợp lý là:

1. JVM warm-up đến trạng thái tương đối ổn định;
2. tạo baseline;
3. chờ một workload/khoảng thời gian đại diện;
4. lấy summary.diff;
5. nếu một category đáng ngờ, mới chuyển sang detail hoặc nguồn bằng chứng khác.

Baseline lấy trong giai đoạn startup có thể chủ yếu phản ánh class loading/JIT/heap expansion bình thường. Nếu mục tiêu là phát hiện rò rỉ ở trạng thái ổn định, hãy đặt baseline sau warm-up; nếu cần theo dõi tăng trưởng từ sớm, hãy tạo baseline sớm và diễn giải cả giai đoạn khởi động.
