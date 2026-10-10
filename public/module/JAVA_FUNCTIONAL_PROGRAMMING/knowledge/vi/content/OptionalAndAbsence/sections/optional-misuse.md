Lỗi phổ biến xuất hiện khi `Optional` trở thành thủ tục hình thức thay vì mô hình rõ ràng cho sự vắng mặt.

- Trả về `null` từ phương thức khai báo `Optional<T>` tạo ra hai cách biểu diễn cùng một trường hợp vắng mặt.
- Gọi `get()` khi chưa chắc có giá trị có thể ném `NoSuchElementException` và thường che mất quy tắc chọn giá trị thay thế hoặc báo lỗi thực sự cần có.
- Bọc một giá trị vào `Optional` rồi lập tức tháo ra chỉ làm mã dài hơn mà không cải thiện hợp đồng.
- Dùng `Optional` cho mọi trường, tham số và tập hợp có thể làm lớp bọc lan khắp mã mà không làm miền nghiệp vụ rõ hơn.
- Đặt tác dụng phụ trong `map` khiến một phép biến đổi trông thuần túy nhưng thực tế lại thay đổi trạng thái; nếu tác dụng phụ mới là mục tiêu, nên đặt nó ở hành động kết thúc hoặc ranh giới rõ ràng.

Hãy dùng `Optional` khi hợp đồng API cần thể hiện rõ khả năng vắng mặt ngay trong kiểu dữ liệu. Nó làm trường hợp vắng mặt hiện rõ với người gọi nhưng không ép người gọi phải xử lý theo một cách duy nhất. Ở chỗ khác, chọn cách biểu diễn trực tiếp nhất cho miền nghiệp vụ.
