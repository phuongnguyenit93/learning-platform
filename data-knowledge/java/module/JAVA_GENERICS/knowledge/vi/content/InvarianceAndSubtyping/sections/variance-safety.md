Giả sử `List<Dog>` có thể gán cho `List<Animal>`:

```java
List<Dog> dogs = new ArrayList<>();
List<Animal> animals = dogs; // giả định
animals.add(new Animal());

Dog dog = dogs.get(0); // đảm bảo kiểu đã bị phá
```

Vấn đề xuất hiện vì `List` vừa **cung cấp** vừa **tiếp nhận** phần tử. Nếu mọi kiểu generic đều hiệp biến thì thao tác ghi sẽ không còn an toàn.

Ví dụ mutable `List` cho thấy rất rõ **vì sao covariance tự động có thể nguy hiểm**, nhưng quy tắc của Java còn rộng hơn: generic class/interface là invariant theo mặc định ngay cả khi một API cụ thể chỉ đọc dữ liệu. Java không tự phân tích từng declaration để suy ra variance từ các method của nó; nếu cần linh hoạt ở nơi sử dụng, wildcard sẽ diễn tả điều đó một cách tường minh.

Vì vậy invariance không phải hạn chế tùy ý; nó ngăn Java tự suy diễn các quan hệ subtype giữa những parameterized type chỉ từ quan hệ của type argument.

Tiếp theo ta dùng chính vấn đề vừa thấy để trả lời câu hỏi: **làm sao chấp nhận một họ kiểu generic liên quan mà vẫn không phá an toàn kiểu?** Đó là vai trò của wildcard.
