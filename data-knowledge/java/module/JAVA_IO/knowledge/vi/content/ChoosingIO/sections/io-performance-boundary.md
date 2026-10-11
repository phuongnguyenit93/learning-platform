I/O thường chậm hơn công việc CPU vì phải đi qua hệ thống tệp, tầng lưu trữ hoặc mạng. Điều đó không có nghĩa cứ dùng API phức tạp hơn là nhanh hơn.

Các nguồn chi phí thường gặp:

~~~text
nhiều lời gọi hệ thống nhỏ
→ buffering có thể giúp

sao chép dữ liệu qua nhiều tầng
→ channel transfer/direct buffer có thể giúp ở tải công việc phù hợp

nạp toàn bộ tệp lớn
→ streaming giảm áp lực bộ nhớ

random access lớn
→ FileChannel/ánh xạ bộ nhớ có thể phù hợp

flush/force quá thường xuyên
→ tăng chi phí bảo đảm dữ liệu được đẩy xuống tầng lưu trữ
~~~

Ở đây **lời gọi hệ thống (system call)** là lời gọi từ chương trình sang hệ điều hành để thực hiện công việc như đọc/ghi tệp; **áp lực bộ nhớ (memory pressure)** là chi phí/rủi ro khi ứng dụng giữ quá nhiều dữ liệu cùng lúc; **tranh chấp tài nguyên (contention)** là nhiều thread/tiến trình cùng cạnh tranh một tài nguyên; còn **độ bền dữ liệu (durability)** nói về mức độ dữ liệu đã được đẩy đủ sâu xuống tầng lưu trữ để tồn tại qua các sự cố mà ứng dụng quan tâm.

Thứ tự quyết định tốt:

~~~text
1. Chọn mức trừu tượng đúng và viết mã cho đúng.
2. Đặt giới hạn bộ nhớ/tài nguyên rõ ràng.
3. Đo tải công việc thực bằng phân tích hiệu năng (profiling), benchmark hoặc số liệu vận hành.
4. Xác định điểm nghẽn thật: CPU, cấp phát bộ nhớ, lời gọi hệ thống, đĩa, mạng hay tranh chấp tài nguyên.
5. Chỉ tối ưu phần đã có bằng chứng.
~~~

Ví dụ, bộ đệm 8 KB không có một con số “tối ưu cho mọi hệ thống”. Kích thước phù hợp phụ thuộc tầng lưu trữ, tải công việc, mức độ xử lý đồng thời và kiểu đọc/ghi. Tương tự, bộ đệm trực tiếp (direct buffer), `transferTo` hay ánh xạ bộ nhớ đều có chi phí riêng.

Với hầu hết mã nghiệp vụ, một cách triển khai rõ ràng dựa trên `Files`, luồng có bộ đệm hoặc Reader/Writer là điểm khởi đầu tốt. Khi phép đo chứng minh đường I/O là điểm nghẽn và chỉ ra nguyên nhân cụ thể, lúc đó mới có đủ thông tin để quyết định Channel, bộ đệm trực tiếp, truyền trực tiếp hoặc ánh xạ có đáng dùng hay không.

Toàn bộ module có thể quay về một mô hình thống nhất:

~~~text
dữ liệu là gì?
→ byte hay ký tự

nguồn và đích là gì?
→ tệp, bộ nhớ, mạng, ...

dữ liệu di chuyển theo kiểu nào?
→ tuần tự, có bộ đệm, channel, truy cập ngẫu nhiên

ai sở hữu tài nguyên bên ngoài?
→ ai mở thì thường đóng, trừ khi quy ước chuyển quyền sở hữu

ranh giới nào phải được nói rõ?
→ charset, kích thước, thao tác từng phần, lỗi, tương thích, bảo mật
~~~

Chọn I/O tốt nghĩa là làm các quyết định này rõ ràng trong mã, rồi chỉ thêm độ phức tạp khi bài toán thực sự cần.
