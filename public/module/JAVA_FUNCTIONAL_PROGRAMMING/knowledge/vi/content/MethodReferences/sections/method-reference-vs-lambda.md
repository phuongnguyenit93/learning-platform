Nên dùng tham chiếu phương thức khi lambda chỉ chuyển tiếp các đối số tới đúng một phương thức hoặc hàm tạo có sẵn và tên thành viên đó đã diễn đạt hành vi rõ ràng.

```java
names.forEach(System.out::println);       // ngắn và dễ nhận ra

Function<String, String> normalized =
        text -> text == null ? "" : text.trim(); // lambda chứa logic thật sự
```

Lambda thường rõ hơn khi cần kiểm tra điều kiện, đổi thứ tự đối số, dùng hằng số, gọi nhiều thao tác, có luồng điều khiển hoặc cần thể hiện ý định mà tên phương thức hiện có không nói rõ.

Không nên coi tham chiếu phương thức là mục tiêu tự thân. Nó chỉ là cú pháp để tái sử dụng hành vi có sẵn dưới một hợp đồng giao diện hàm; khả năng đọc mới là tiêu chí lựa chọn.
