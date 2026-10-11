# Nền tảng Collection: Vì sao Collections Framework tồn tại?

Trước khi học `List`, `Set`, `Map` hay `Queue`, cần trả lời một câu đơn giản hơn: **Collection là gì và tại sao chương trình Java lại cần nó?**

Giả sử chương trình chỉ có ba đơn hàng. Ta hoàn toàn có thể viết ba biến riêng:

```java
Order first = new Order(1001, 7, 120);
Order second = new Order(1002, 8, 90);
Order third = new Order(1003, 7, 150);
```

Nhưng dữ liệu thực tế hiếm khi dừng ở con số ba. Số lượng đơn hàng có thể là 0, 10, 1.000 hoặc thay đổi trong lúc chương trình chạy. Khi đó mã nguồn cần một cách để **gom nhiều đối tượng lại thành một nhóm và thao tác với cả nhóm đó**: thêm phần tử, xóa phần tử, tìm kiếm, duyệt, kiểm tra số lượng, giữ thứ tự, loại trùng hoặc tra cứu theo khóa.

Đó là bài toán mà Java Collections Framework giải quyết.

Trong module này, hãy dùng một bộ dữ liệu nhỏ làm ví dụ xuyên suốt:

```java
record User(long id, String name) {}
record Order(long id, long userId, int totalCents) {}
```

Ta có thể giữ các `Order` theo thứ tự tạo, tập hợp các `userId` duy nhất, ánh xạ `orderId → Order`, hoặc đưa đơn hàng vào hàng đợi xử lý. Cùng là “nhiều phần tử”, nhưng mỗi bài toán có một hợp đồng khác nhau.
