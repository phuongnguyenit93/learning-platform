Một tham chiếu phương thức không có kiểu hàm hữu ích khi đứng riêng. Java diễn giải nó dựa trên giao diện hàm làm kiểu đích rồi kiểm tra xem lời gọi được tham chiếu có đáp ứng được kiểu hàm của giao diện đó hay không.

Các phần cần khớp gồm:

- số lượng và thứ tự tham số của kiểu đích;
- cách ánh xạ đối tượng nhận với phương thức thực thể;
- các phép chuyển đổi tham số mà lời gọi phương thức Java cho phép;
- tính tương thích giữa kết quả phương thức và kết quả của kiểu đích;
- quy tắc chọn nạp chồng khi có nhiều thành viên cùng tên.

```java
Function<String, Integer> decimal = Integer::parseInt;
ToIntFunction<String> decimalPrimitive = Integer::parseInt;
```

Hai tham chiếu đều dùng cùng một thao tác, nhưng hợp đồng đích khác nhau: một cái cho ra `Integer`, cái còn lại cho ra `int` nguyên thủy. Quy tắc đóng hộp/mở hộp (boxing/unboxing) thông thường cùng với kiểu đích quyết định phép gán có hợp lệ hay không.
