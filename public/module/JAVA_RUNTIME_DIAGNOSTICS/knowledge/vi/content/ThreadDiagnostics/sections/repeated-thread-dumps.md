Một dump chỉ cho một thời điểm. Để phân biệt trạng thái tạm thời với vấn đề liveness, hãy lấy **nhiều dump cách nhau một khoảng ngắn phù hợp với sự cố**.

Ví dụ:

~~~text
t0      thread A → same stack / same lock
t0+10s  thread A → same stack / same lock
t0+20s  thread A → same stack / same lock
~~~

Nếu nhiều thread xử lý request giữ nguyên quan hệ stack/lock qua nhiều ảnh chụp trong lúc lưu lượng vẫn đến, giả thuyết “stuck/blocking” mạnh hơn.

Ngược lại, stack thay đổi liên tục có thể cho thấy thread vẫn tiến triển dù mỗi ảnh chụp nhìn có vẻ “bận”.

Các lần dump lặp nên:

- dùng cùng PID;
- ghi timestamp;
- giữ khoảng cách nhất quán;
- tránh khoảng lấy mẫu quá dày gây nhiễu;
- đối chiếu với CPU/latency/log trong cùng khoảng thời gian.

Khi cần dòng thời gian rõ hơn thay vì ảnh chụp thủ công, JFR là bước tiếp theo tự nhiên.
