Java đánh giá các biểu thức đối số từ trái sang phải trước khi thân phương thức chạy.

Tác dụng phụ trong đối số vẫn có thể làm mã khó hiểu:

```java
call(i++, update(i));
```

Khi thứ tự có ý nghĩa nghiệp vụ, tách phép tính ra biến riêng thường rõ hơn.

Đối tượng nhận lời gọi (receiver) và các biểu thức đối số được đánh giá trước khi thân phương thức chạy. Phương thức chỉ nhận **giá trị kết quả** của các biểu thức đó; nó không nhận chính biểu thức hay “ô biến” của bên gọi.

Điều này nối trực tiếp sang chương truyền bằng giá trị.
