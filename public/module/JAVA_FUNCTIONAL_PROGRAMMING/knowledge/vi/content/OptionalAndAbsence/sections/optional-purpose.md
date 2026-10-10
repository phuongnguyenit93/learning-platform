API thường cần diễn đạt rằng "có thể không có giá trị". Trả về `null` có thể biểu diễn điều đó, nhưng người gọi rất dễ bỏ quên trường hợp vắng mặt vì bản thân kiểu dữ liệu không nhắc họ phải xử lý nó.

`Optional<T>` đưa khả năng vắng mặt vào chính kiểu trả về. Có thể hình dung nó như một hộp chứa đúng một giá trị khác `null`, hoặc không chứa giá trị nào.

```java
Optional<User> findUser(String id) {
    // trả về Optional.empty() khi không tìm thấy người dùng
}
```

`Optional` không xóa `null` khỏi Java và cũng không phải lớp bọc nên dùng cho mọi tham chiếu. Nó hữu ích nhất ở những ranh giới API nơi việc không có kết quả là tình huống bình thường và có thể dự đoán trước.
