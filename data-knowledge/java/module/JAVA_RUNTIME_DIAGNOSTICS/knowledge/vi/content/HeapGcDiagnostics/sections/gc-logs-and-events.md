GC logs cung cấp dòng thời gian về hoạt động thu gom. Với unified logging:

~~~text
-Xlog:gc*
~~~

Bằng chứng GC giúp trả lời:

- collection xảy ra bao nhiêu lần?
- pause time có tăng không?
- heap trước/sau GC thay đổi thế nào?
- collector có reclaim được memory không?

Ví dụ suy luận:

~~~text
GC chạy liên tục
post-GC heap vẫn tăng
→ giả thuyết object bị giữ lại mạnh hơn

GC chạy thường xuyên
post-GC heap ổn định
→ áp lực cấp phát / cấu hình kích thước heap có thể đáng xem hơn
~~~

Các GC event trong JFR bổ sung dòng thời gian để đối chiếu với CPU/thread/I/O.

Không dùng GC log để tự suy ra cơ chế nội bộ của collector vượt phạm vi; khi cần giải thích sâu hành vi collector, chuyển sang module JVM.
