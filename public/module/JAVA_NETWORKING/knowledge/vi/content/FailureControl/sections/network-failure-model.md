Lỗi mạng nên được phân loại theo vòng đời thay vì catch IOException rồi ghi một thông điệp chung.

Ví dụ:

~~~text
resolve
→ UnknownHostException

bind
→ BindException / address already in use / permission

connect
→ ConnectException / timeout / route failure

read-write
→ SocketTimeoutException / EOF / reset / IOException

closed resource
→ SocketException / ClosedChannelException
~~~

**EOF không giống timeout.** Với TCP stream, read trả -1 thường nghĩa peer đã kết thúc output theo cách mà local side quan sát như end-of-stream. Timeout nghĩa chưa có dữ liệu trong khoảng chờ đã cấu hình. Connection reset lại là một dạng termination khác.

Bối cảnh rất quan trọng. Một ConnectException tới đúng host/port nói điều khác hoàn toàn với UnknownHostException trước khi có IP.

Log hữu ích nên giữ giai đoạn, local/remote endpoint và thao tác, nhưng không log payload bí mật. Phân loại tốt giúp quyết định việc nào có thể retry, việc nào là lỗi cấu hình, và việc nào phải handoff sang resilience policy ở module khác.
