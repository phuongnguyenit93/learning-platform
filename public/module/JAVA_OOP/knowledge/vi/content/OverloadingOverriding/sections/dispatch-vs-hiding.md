Có thể ghi nhớ nhanh bằng bảng sau:

| Thành phần | Thời điểm quyết định chính | Với `Parent x = new Child()` |
| --- | --- | --- |
| Chữ ký phương thức nạp chồng | Lúc biên dịch | Dựa trên kiểu của đối số |
| Phương thức đối tượng bị ghi đè | Lúc chạy | Có thể chạy phần thân của `Child` |
| Phương thức `static` bị che khuất | Lúc biên dịch | Theo kiểu `Parent` |
| Trường bị che khuất | Lúc biên dịch | Theo kiểu `Parent` |

### MINH CHỨNG — `DispatchController#dispatchVsHiding()`

Ví dụ thực thi trả về cùng lúc:

```text
runtime        = Child
instanceMethod = Child.call
staticMethod   = Parent.staticCall
field          = parent-field
```

Cùng một đối tượng thực tế lúc chạy là `Child`, nhưng các loại thành viên khác nhau lại được chọn theo các quy tắc khác nhau.

Đây là minh chứng rõ nhất để tránh hiểu nhầm:

> “Gọi qua đối tượng thì mọi thứ đều được chọn động lúc chạy.”

Điều đó **không đúng**.

### MỐI LIÊN HỆ — từ kế thừa sang kết hợp đối tượng

Kế thừa kết hợp với ghi đè rất mạnh, nhưng cây kế thừa càng sâu thì các class càng phụ thuộc nhau chặt.

Nếu mục tiêu chỉ là thay đổi một hành vi, ta có thể không cần tạo thêm class con. **Kết hợp đối tượng (composition)** cho phép thay đối tượng cộng tác thay vì kéo dài cây kế thừa.
