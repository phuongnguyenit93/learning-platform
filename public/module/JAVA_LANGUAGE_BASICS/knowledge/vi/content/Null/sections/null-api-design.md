API nên làm rõ:

- tham số có chấp nhận `null` không;
- giá trị trả về có thể `null` không;
- collection có chứa `null` không;
- null có nghĩa “không có”, “chưa tải”, hay “không hợp lệ”.

Không phải mọi trường hợp “vắng giá trị” đều cần `Optional`, nhưng hợp đồng mơ hồ về `null` làm bên gọi phải đoán và tạo NPE xa nguồn gốc.

### Phát hiện sớm khi `null` không hợp lệ

```java
UserService(UserRepository repository) {
    this.repository = Objects.requireNonNull(repository);
}
```

Nếu `null` vi phạm bất biến, kiểm tra sớm giúp lỗi xuất hiện gần ranh giới gây ra nó.

### `null`, giá trị rỗng và trạng thái vắng mặt phải có hợp đồng

API collection thường nên quyết định rõ:

- trả `null` hay collection rỗng khi không có phần tử;
- có cho phép phần tử `null` không;
- tham số `null` có nghĩa gì;
- trạng thái vắng mặt là trạng thái bình thường hay lỗi.

`Optional` có thể hữu ích cho một số hợp đồng trả về về trạng thái vắng mặt, nhưng không phải lựa chọn thay thế tự động cho mọi trường/tham số có thể `null`. Quan trọng nhất là ngữ nghĩa nhất quán và bên gọi không phải đoán.

Chương tiếp theo giải thích kiểu bao và vì sao unboxing một giá trị `null` có thể thất bại.
