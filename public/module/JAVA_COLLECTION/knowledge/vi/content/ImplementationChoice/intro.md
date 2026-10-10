# Lựa chọn cách triển khai Collection

Chặng cuối của ROADMAP, **Lựa chọn cách triển khai và cấu trúc chuyên biệt**, tổng hợp các quy ước đã học thành một quy trình ra quyết định thực tế. Chọn collection nên bắt đầu từ **ngữ nghĩa mà bài toán cần**: có cần chỉ số không, có cho phần tử trùng không, có cần tra cứu theo khóa không, thứ tự nào phải được bảo toàn, phần tử nào cần lấy ra trước. Sau khi quy ước đúng mới xét độ phức tạp, bộ nhớ, khả năng thay đổi, chính sách `null` và kiểu sử dụng.

Việc chọn chỉ vì “`HashMap` nhanh” hoặc “`LinkedList` chèn O(1)” dễ sai vì độ phức tạp còn phụ thuộc thao tác đi kèm. Ví dụ chèn vào giữa `LinkedList` vẫn phải tìm nút trước nếu bên gọi chỉ có chỉ số.
