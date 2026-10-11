```java
Animal animal = new Dog();
```

Ở đây:

```text
kiểu lúc biên dịch / kiểu khai báo
→ Animal

kiểu thực tế của đối tượng lúc chạy
→ Dog
```

Trình biên dịch dùng `Animal` để kiểm tra thành viên nào được gọi hợp lệ và áp dụng các quy tắc chuyển đổi/nạp chồng. Đối tượng thực tế `Dog` ở thời điểm chạy tham gia cơ chế phân phối lời gọi động cho phương thức instance đã được ghi đè.

Hai kiểu này trả lời hai câu hỏi khác nhau và cả hai đều cần thiết.

### Kiểu tĩnh thuộc về góc nhìn của biểu thức/tham chiếu

Trình biên dịch không “nhìn xuyên” đối tượng thực tế tùy ý để cho phép gọi mọi thành viên của kiểu con:

```java
Animal animal = new Dog();
animal.eat();
// animal.bark(); // không biên dịch được nếu Animal không khai báo bark
```

Dù đối tượng thực tế là `Dog`, biểu thức `animal` có kiểu tĩnh `Animal`. Muốn gọi API chỉ có ở `Dog`, mã cần quan hệ kiểu, kiểm tra và ép kiểu phù hợp — hoặc một thiết kế trừu tượng tốt hơn.

### Kiểu lúc chạy ảnh hưởng những kiểm tra/hành vi nào?

Kiểu thực tế của đối tượng tham gia phân phối lời gọi động của phương thức instance đã ghi đè, kiểm tra downcast và kiểm tra kiểu phần tử mảng. Nó không làm quá trình chọn overload “chạy lại” ở thời điểm chạy.
