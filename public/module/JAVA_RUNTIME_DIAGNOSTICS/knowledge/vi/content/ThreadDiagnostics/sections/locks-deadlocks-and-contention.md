**Contention** xảy ra khi nhiều thread cạnh tranh một tài nguyên/lock. **Deadlock** là trường hợp mạnh hơn: một tập thread tạo vòng chờ khiến không thread nào trong vòng có thể tiến triển.

Ví dụ deadlock:

~~~text
Thread A giữ Lock 1 → chờ Lock 2
Thread B giữ Lock 2 → chờ Lock 1
~~~

Thread dump có thể cho thấy quan hệ giữa thread giữ lock và thread đang chờ; một số lệnh chẩn đoán của JDK còn báo deadlock được phát hiện.

Điều tra contention:

- tìm nhiều thread BLOCKED trên cùng monitor;
- xác định thread đang giữ lock;
- xem thread đó đang chạy mã gì;
- lặp dump để xem mẫu có kéo dài;
- đối chiếu với các JFR event về monitor/park khi cần thời lượng và dòng thời gian.

Phát hiện deadlock không đồng nghĩa tìm được mọi lỗi liveness. Starvation, chờ I/O bên ngoài, executor bị bão hòa hoặc logical livelock có thể làm hệ thống không tiến triển mà không tạo vòng khóa.
