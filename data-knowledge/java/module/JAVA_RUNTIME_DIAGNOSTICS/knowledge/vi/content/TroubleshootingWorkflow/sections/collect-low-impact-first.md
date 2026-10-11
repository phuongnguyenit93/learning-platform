Ưu tiên bằng chứng theo nguyên tắc **tác động thấp → tập trung → xâm lấn cao**.

Ví dụ:

~~~text
logs / metrics sẵn có
        ↓
thông tin jcmd / ảnh chụp thread / JMX
        ↓
dữ liệu JFR mặc định/chạy liên tục
        ↓
histogram / focused recording
        ↓
heap dump / core dump / invasive attach
~~~

“Rẻ” không chỉ là chi phí CPU. Cần tính cả:

- pause time;
- lượng disk/network;
- nguy cơ làm tiến trình thiếu bộ nhớ hơn;
- độ nhạy cảm dữ liệu;
- thời gian của người vận hành;
- khả năng bằng chứng biến mất nếu chờ quá lâu.

Đôi khi dữ liệu chẩn đoán nặng phải được lấy ngay, ví dụ tiến trình sắp bị restart hoặc OOME đang diễn ra. Nguyên tắc tác động thấp không có nghĩa là trì hoãn bằng chứng không thể tái tạo.
