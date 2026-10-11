Nhiều transformer được **ghép thành chuỗi**:

~~~text
bytes đầu vào
  ↓ transformer A
bytes A
  ↓ transformer B
bytes B
  ↓ transformer C
bytes cuối cùng
~~~

Đầu ra byte[] của transformer trước trở thành classfileBuffer của transformer sau. Vì vậy một transformer không nhất thiết thấy “class gốc”; nó có thể thấy class đã bị transformer trước chỉnh sửa.

Ví dụ:

~~~text
coverage agent
→ chèn counter

APM agent
→ nhận bytes đã có counter
→ chèn span đo thời gian
~~~

Hệ quả thiết kế:

- tránh phụ thuộc vào bố trí byte chính xác nếu không cần;
- bộ phân tích phải chịu được attribute/code do công cụ khác thêm;
- cần kiểm thử khả năng cùng tồn tại với agent khác;
- phép biến đổi nên giữ ngữ nghĩa của phần không thuộc trách nhiệm mình.

Việc ghép chuỗi là lý do hệ sinh thái agent cần công cụ bytecode đủ bền vững và tương thích phiên bản.
