Hành vi trả về đặc biệt hữu ích khi nó cần nhớ dữ liệu từ lần gọi phương thức đã tạo ra nó. Lambda bắt giữ các giá trị đó và có thể dùng lại về sau.

```java
static Function<String, String> prefixWith(String prefix) {
    return value -> prefix + value;
}

Function<String, String> errorLabel = prefixWith("ERROR: ");
System.out.println(errorLabel.apply("Disk full"));
```

Mỗi lần gọi `prefixWith` tạo ra một hành vi gắn với `prefix` của lần gọi đó. Biến cục bộ được bắt giữ vẫn phải tuân theo quy tắc `final` hoặc không bị gán lại sau khi khởi tạo (effectively final) đã học ở chương trước.

Việc bắt giữ một tham chiếu không làm đối tượng được tham chiếu trở thành bất biến. Nếu hành vi trả về quan sát trạng thái có thể thay đổi, kết quả của nó có thể thay đổi theo các lần chỉnh sửa sau này và trở nên khó suy luận hơn.
