Những phương thức thường gặp:

- `getClass()` — cho biết lớp thực tế của đối tượng khi chương trình chạy;
- `toString()` — cung cấp biểu diễn dạng chuỗi phục vụ quan sát/chẩn đoán;
- `equals()` — điểm mở rộng để định nghĩa bằng nhau theo logic;
- `hashCode()` — cung cấp giá trị băm phải nhất quán với `equals()`;
- `wait()/notify()/notifyAll()` — các cơ chế phối hợp luồng cấp thấp dựa trên monitor của đối tượng; học sâu ở phần lập trình đồng thời;
- `clone()` — cơ chế sao chép cũ, có nhiều giới hạn;
- `finalize()` — cơ chế dọn dẹp cũ đã bị loại bỏ dần và không nên dùng để quản lý tài nguyên.

`equals`, `hashCode`, `toString` có quy ước hành vi riêng và được học sâu hơn trong mô-đun `object-contract`. `getClass()` được dùng sâu hơn trong Reflection; `wait/notify` thuộc phạm vi lập trình đồng thời.
