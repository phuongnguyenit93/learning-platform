Phong cách hàm bổ sung cho thiết kế Java hiện có. Một ứng dụng thực tế có thể đồng thời dùng:

- đối tượng để mô hình hóa trạng thái và trách nhiệm nghiệp vụ;
- câu lệnh mệnh lệnh cho các quy trình tuần tự rõ ràng;
- giao diện hàm và lambda khi hành vi là phần cần thay đổi;
- phương thức thông thường khi việc đặt tên giúp mã dễ đọc và tái sử dụng hơn.

Ví dụ, một dịch vụ vẫn có thể giữ phụ thuộc và trạng thái như thiết kế hướng đối tượng, nhưng nhận thêm `Predicate<Order>` để tùy biến một quyết định. Việc có lambda không biến toàn bộ hệ thống thành chương trình "thuần hàm".

Mô-đun này tập trung vào **cơ chế lập trình hàm của Java**. Các khái niệm độc lập với ngôn ngữ như hàm thuần túy, tính bất biến hay tính trong suốt tham chiếu thuộc mô-đun Mô hình lập trình hàm (Functional Programming). Ở đây chỉ nhắc tới chúng khi cần giải thích một lựa chọn cụ thể trong Java.
