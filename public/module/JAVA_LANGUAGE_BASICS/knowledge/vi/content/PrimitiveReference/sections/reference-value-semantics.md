Java không yêu cầu lập trình viên coi tham chiếu như một địa chỉ bộ nhớ vật lý có thể thao tác trực tiếp.

Mô hình tư duy đủ dùng:

```text
giá trị tham chiếu
→ có thể nhận diện đối tượng/mảng
→ có thể được sao chép
→ có thể so tính đồng nhất bằng ==
→ có thể được truy cập (dereference)
→ có thể là null
```

Một đối tượng có thể có nhiều alias. Mất một tham chiếu không đồng nghĩa đối tượng bị hủy nếu vẫn còn đường tham chiếu khác tới đối tượng đó.

### Alias, tính đồng nhất và trạng thái

```java
User a = new User("A");
User b = a;
User c = new User("A");
```

- `a` và `b` là hai biến chứa giá trị tham chiếu cùng nhận diện một đối tượng;
- `c` nhận diện đối tượng khác, dù trạng thái ban đầu có thể giống;
- `a == b` kiểm tra tính đồng nhất của tham chiếu và là `true`;
- `a == c` là `false` trong ví dụ này;
- so sánh bằng theo giá trị của đối tượng là chủ đề của `equals`, được đào sâu trong mô-đun Object Contract.

### Phép gán không sao chép đối tượng

```java
User original = new User("A");
User alias = original;
```

Dòng thứ hai **không tạo `User` mới** và không sao chép toàn bộ trường của đối tượng. Nó chỉ sao chép giá trị tham chiếu. Nếu cần đối tượng độc lập, API phải có cơ chế sao chép/constructor/factory phù hợp; đó là một quyết định thiết kế riêng.

chương tiếp theo hỏi: **một biến thuộc loại nào, tồn tại trong bao lâu, và tên của nó nhìn thấy ở đâu?**
