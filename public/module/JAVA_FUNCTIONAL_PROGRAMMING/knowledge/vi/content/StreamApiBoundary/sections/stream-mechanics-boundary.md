Mô-đun này sở hữu các cơ chế lập trình hàm mà Stream API *sử dụng*: giao diện hàm, lambda, tham chiếu phương thức, kiểu đích, bắt giữ biến và kết hợp hành vi.

Mô-đun Stream API chuyên biệt sở hữu các cơ chế của Stream, bao gồm:

- cách tạo Stream và nguồn Stream;
- ngữ nghĩa của thao tác trung gian và thao tác kết thúc;
- tính lười và thời điểm thực thi;
- phép rút gọn và bộ thu thập (`Collector`);
- thứ tự phần tử và hành vi liên quan đến thứ tự;
- Stream song song và các ràng buộc đi kèm.

Các chủ đề đó chỉ được nêu tên ở đây để xác định ranh giới, không được triển khai chi tiết. Ranh giới này giúp tránh hai nhầm lẫn phổ biến: lambda không phải là Stream, và biết cú pháp lambda chưa đồng nghĩa với hiểu cơ chế thực thi của Stream.
