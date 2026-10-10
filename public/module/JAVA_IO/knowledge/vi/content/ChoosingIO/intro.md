# Chọn cách I/O đơn giản nhưng đúng

Java có nhiều I/O API vì các bài toán khác nhau cần **mô hình xử lý khác nhau**. Mục tiêu không phải học thuộc một “API mạnh nhất”, mà là chọn lớp đơn giản nhất vẫn biểu diễn đúng loại dữ liệu, kích thước, kiểu truy cập và vòng đời tài nguyên.

Một câu hỏi tốt thường đi theo thứ tự:

~~~text
Đang xử lý byte, văn bản hay dữ liệu nhị phân có cấu trúc?
→ dữ liệu nhỏ có giới hạn hay có thể rất lớn?
→ xử lý tuần tự hay cần truy cập ngẫu nhiên/Channel?
→ định dạng nhị phân quy định thứ tự byte/framing nào?
→ charset nào?
→ ai sở hữu tài nguyên?
→ nếu có lỗi thì dữ liệu có thể mới xử lý được một phần không?
→ có bằng chứng đo đạc nào cho thấy cần tối ưu hiệu năng không?
~~~
