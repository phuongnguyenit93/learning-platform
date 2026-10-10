Một recording có vòng đời cơ bản:

~~~text
configure
   ↓
start
   ↓
record events
   ↓
dump / stop
   ↓
analyze
~~~

Có thể bắt đầu từ startup:

~~~text
java -XX:StartFlightRecording=filename=app.jfr,settings=default -jar app.jar
~~~

hoặc trên JVM đang chạy:

~~~text
jcmd <pid> JFR.start name=incident settings=default
jcmd <pid> JFR.check
jcmd <pid> JFR.dump name=incident filename=incident.jfr
jcmd <pid> JFR.stop name=incident filename=incident-final.jfr
~~~

Dump không nhất thiết phải dừng recording; điều này hữu ích khi muốn lấy một cửa sổ bằng chứng nhưng vẫn giữ continuous recording chạy tiếp.

Tên recording rất quan trọng nếu một JVM có nhiều recording. Ghi lại tên/ID ngay khi start để tránh dump nhầm.
