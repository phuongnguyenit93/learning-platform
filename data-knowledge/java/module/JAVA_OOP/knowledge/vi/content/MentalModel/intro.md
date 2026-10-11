# Lập trình hướng đối tượng (OOP) là gì và vì sao cần?

Lập trình hướng đối tượng (**Object-Oriented Programming - OOP**) không bắt đầu từ `class`, `extends` hay `interface`. Nó bắt đầu từ một câu hỏi thiết kế: **nên đặt dữ liệu, quy tắc và trách nhiệm ở đâu để khi chương trình thay đổi, ảnh hưởng không lan ra khắp nơi?**

Hãy hình dung một chức năng thanh toán đơn giản. Ban đầu ta hoàn toàn có thể viết một hàm lớn để đọc giỏ hàng, tính giá, chọn hình thức thanh toán và cập nhật trạng thái đơn hàng. Khi yêu cầu tăng dần, hàm đó sẽ có ngày càng nhiều `if/else`, nhiều nơi cùng đọc hoặc sửa một dữ liệu, và nhiều đoạn mã cùng phải biết những quy tắc giống nhau.

OOP là một cách tổ chức lại chương trình để **đưa dữ liệu và hành vi có liên quan về đúng đối tượng chịu trách nhiệm**, từ đó giúp việc thay đổi dễ kiểm soát hơn.
