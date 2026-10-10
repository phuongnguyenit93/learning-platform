Các bẫy phổ biến:

**RUNNABLE = đang ăn CPU**  
Không luôn đúng. Cần CPU sample, JFR hoặc bằng chứng từ hệ điều hành.

**WAITING/BLOCKED = bug**  
Nhiều wait là hành vi thiết kế bình thường.

**Một dump đủ chứng minh stuck**  
Một ảnh chụp đơn lẻ thiếu yếu tố thời gian.

**Thread nhiều = vấn đề**  
Với virtual threads, số lượng lớn là bình thường; cần xét loại thread và workload.

**Chỉ đọc thread name**  
Tên có thể được tái sử dụng hoặc do framework đặt; stack và ngữ cảnh quan trọng hơn.

**Thấy deadlock-free rồi kết luận liveness ổn**  
Starvation, I/O stall, executor queue saturation vẫn có thể tồn tại.

**Dùng ThreadMXBean để đếm virtual threads**  
Java 21 ThreadMXBean chỉ bao phủ platform threads.

Khi câu hỏi chuyển từ “thread đang chờ ở đâu” sang “thiết kế đồng bộ có đúng không”, hãy chuyển sang module Concurrency.
