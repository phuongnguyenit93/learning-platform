Hai module trả lời câu hỏi khác nhau:

~~~text
Instrumentation
→ code/probe được chèn vào runtime như thế nào?

Runtime Diagnostics
→ bằng chứng thu được nói gì và tìm nguyên nhân gốc thế nào?
~~~

Nếu câu hỏi là:

- “làm sao thêm timing probe vào class đã được nạp?” → Instrumentation;
- “vì sao service latency cao?” → Runtime Diagnostics;
- “agent có làm latency tăng không?” → cần cả hai: Instrumentation để hiểu overhead của probe, Diagnostics để đo/đánh giá bằng chứng runtime.

Ranh giới này cũng giúp thiết kế công cụ: lớp thu thập dữ liệu/probe nên tách khỏi lớp phân tích/trình bày khi có thể.
