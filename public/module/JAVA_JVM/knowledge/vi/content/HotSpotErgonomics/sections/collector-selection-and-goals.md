Collector selection nên bắt đầu từ workload goal thay vì preference cá nhân.

Các câu hỏi:

- latency SLO có nghiêm ngặt không?
- throughput quan trọng hơn pause không?
- heap/live set lớn cỡ nào?
- CPU budget có đủ cho concurrent GC không?
- footprint có bị giới hạn chặt không?

Oracle GC tuning guide khuyến nghị bắt đầu bằng VM defaults nếu workload không có yêu cầu pause đặc biệt, rồi đo trước khi đổi collector.

Collector là một system-level trade-off. Đổi collector có thể thay đổi CPU, pause distribution, footprint và operational characteristics; không chỉ là “bật một flag để nhanh hơn”.
