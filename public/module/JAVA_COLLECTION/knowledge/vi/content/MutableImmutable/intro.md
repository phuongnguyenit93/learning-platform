# Quyền thay đổi dữ liệu và các khung nhìn của Collection

Chương này mở đầu chặng **Khả năng thay đổi, khung nhìn và Fail-Fast** bằng câu hỏi ai sở hữu quyền thay đổi cấu trúc. Khi một phương thức trả về collection, câu hỏi quan trọng không chỉ là “có những phần tử nào” mà còn là “ai được quyền thay đổi cấu trúc này?”. Java có nhiều mức khác nhau: collection có thể sửa, khung nhìn (view) chặn thao tác sửa, bản chụp (snapshot) không liên kết với collection nguồn, và các phương thức tạo collection không cho phép sửa.

Các khái niệm này mô tả **quyền thay đổi collection**. Chúng không tự biến đối tượng bên trong collection thành bất biến. Chương tiếp theo giữ cùng chặng học nhưng tập trung vào điều xảy ra khi cấu trúc bị thay đổi trong lúc Iterator đang duyệt.
