Overhead xuất hiện ở hai giai đoạn:

**Khởi động / nạp class**

- matcher/bộ lọc cho mỗi class;
- phân tích/biến đổi/sinh bytecode;
- verification/JIT warm-up có thể thay đổi;
- chuỗi nhiều agent làm tăng chi phí.

**Runtime**

- instruction của probe;
- lời gọi helper;
- cấp phát;
- timestamp/counter/locking;
- đệm/xuất telemetry.

Một agent tốt đo overhead của chính mình:

~~~text
ứng dụng cơ sở
vs
agent đã nạp nhưng chưa có mục tiêu
vs
agent có instrumentation đại diện
~~~

Lọc mục tiêu sớm, tránh công việc nặng trong callback transform và dùng batching/sampling ở runtime giúp giảm chi phí.

Agent observability làm ứng dụng chậm đáng kể có thể làm sai chính dữ liệu nó đo.
