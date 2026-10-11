Phân tích postmortem mạnh nhất khi nhiều nguồn dữ liệu xác nhận lẫn nhau.

Ví dụ một sự cố bộ nhớ:

~~~text
OOME / bộ nhớ tiến trình tăng
        ↓
GC log cho thấy heap liên tục đầy?
        ↓
heap dump cho thấy retained object tăng?
        ↓
JFR cho thấy allocation source nào?
        ↓
NMT cho thấy tăng nằm trong JVM native category hay không?
~~~

Ví dụ một crash native:

~~~text
hs_err problematic frame
        ↓
native stack trong core dump
        ↓
JFR/log ngay trước crash
        ↓
thay đổi thư viện/JNI gần đây
~~~

Không phải mọi nguồn phải cùng “nói một điều”. Mâu thuẫn giữa chúng đôi khi là tín hiệu quan trọng: RSS tăng nhưng heap/NMT không tăng gợi ý allocation bên ngoài phạm vi đang quan sát; CPU cao nhưng ảnh chụp thread không lặp lại hot stack có thể là spike ngắn hoặc sampling sai thời điểm.

Mục tiêu là xây một giả thuyết có thể bị bác bỏ, không phải chọn dữ liệu phù hợp với kết luận có sẵn.
