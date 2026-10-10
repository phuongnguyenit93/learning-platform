JDK cung cấp **jfr CLI** để thao tác file recording mà không cần GUI:

~~~text
jfr summary recording.jfr
jfr print recording.jfr
jfr print --events <event-list> recording.jfr
jfr metadata recording.jfr
~~~

CLI phù hợp cho tự động hóa, kiểm tra nhanh và lọc dữ liệu lặp lại trong terminal.

**JDK Mission Control (JMC)** cung cấp UI mạnh hơn để xem dòng thời gian, phân tích tự động, hot methods, memory và đối chiếu event. JMC là công cụ đồng hành trong hệ sinh thái JDK; không nên giả định nó luôn được đóng gói cùng runtime.

Ranh giới:

- JFR = cơ chế ghi recording/event;
- jcmd / StartFlightRecording = điều khiển recording;
- `jfr` CLI = kiểm tra/in nội dung file;
- JMC = UI trực quan hóa/phân tích.

Học JFR không đồng nghĩa phải học mọi tính năng JMC. Module này tập trung cách dùng recording làm bằng chứng chẩn đoán.
