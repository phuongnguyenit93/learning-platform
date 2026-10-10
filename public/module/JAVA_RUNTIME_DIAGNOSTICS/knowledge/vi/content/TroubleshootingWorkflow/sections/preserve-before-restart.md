Restart là một thao tác phục hồi, không phải kết luận chẩn đoán. Nếu hệ thống cho phép, trước restart hãy hỏi:

1. Có trạng thái thread/JFR nào sẽ mất?
2. Có cần heap dump hoặc NMT diff không?
3. Fatal/core dump đã được sao chép khỏi vùng lưu trữ tạm thời chưa?
4. Log rotation có sắp xóa time window cần điều tra không?
5. PID/container cũ có metadata nào phải ghi lại?

Một checklist ngắn thường hữu ích:

~~~text
[ ] timestamp + PID/container
[ ] bằng chứng thread
[ ] JFR dump
[ ] bằng chứng bộ nhớ nếu liên quan
[ ] logs + JVM flags/version
[ ] crash artifacts nếu có
[ ] copy ra persistent storage
~~~

Không cố “thu đủ mọi thứ” khi service đang critical. Hãy cân bằng SLA với tính độc nhất và giá trị của bằng chứng.
