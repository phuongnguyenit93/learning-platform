Không phải chỉ `HashSet` và `HashMap` mới quan tâm đến tính bằng nhau. Nhiều API collection dùng `equals` để xác định phần tử khớp:

- `List.contains(x)` và `List.remove(x)` tìm phần tử bằng `equals`.
- `HashSet` dùng `hashCode` để thu hẹp vùng tìm kiếm rồi dùng `equals` để xác nhận.
- `HashMap` áp dụng cùng ý tưởng cho khóa.
- tính bằng nhau của `List` và nhiều collection khác cũng được xây dựng từ tính bằng nhau của phần tử.

Với record đơn giản, Java tạo tính bằng nhau theo toàn bộ thành phần:

```java
record User(long id, String email) {}

List<User> users = new ArrayList<>();
users.add(new User(10, "a@example.com"));

System.out.println(users.contains(new User(10, "a@example.com"))); // true
```

Nếu nghiệp vụ muốn “User cùng id là cùng định danh” nhưng `equals` lại tính cả email, collection sẽ phản ánh đúng quy ước Java hiện tại, không phản ánh ý định nghiệp vụ chưa được mã hóa. Vì vậy trước khi trách collection, cần kiểm tra mô hình tính bằng nhau của phần tử.
