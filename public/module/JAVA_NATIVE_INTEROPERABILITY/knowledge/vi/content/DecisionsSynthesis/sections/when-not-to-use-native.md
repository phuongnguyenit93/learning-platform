Không nên dùng native interoperability chỉ vì API trông “low-level” hoặc có kỳ vọng mơ hồ rằng native sẽ nhanh hơn.

Nên ưu tiên giải pháp managed Java khi:

- JDK hoặc thư viện Java đã cung cấp khả năng tương đương;
- lợi ích native nhỏ nhưng ma trận triển khai lớn;
- đội ngũ không kiểm soát được native binary/version;
- khả năng cô lập lỗi quan trọng hơn vài phần trăm hiệu năng;
- workload chủ yếu bị giới hạn bởi I/O/network thay vì đoạn xử lý native cụ thể.

Việc vượt qua boundary còn có overhead riêng và làm profiling/debugging khó hơn. Chỉ nên nhận chi phí đó khi phía native đem lại khả năng hoặc giá trị đo được.

Quyết định “không dùng native” cũng là một kết quả thiết kế hợp lệ.
