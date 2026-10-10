Nếu phương thức có nhiều phiên bản nạp chồng, Java dùng kiểu hàm đích để chọn thành viên tương thích. Phần lớn trường hợp hoạt động tự nhiên, nhưng ngữ cảnh kiểu đích chưa rõ hoặc có nhiều phiên bản nạp chồng cùng phù hợp có thể tạo ra sự mơ hồ.

```java
Function<String, Integer> parseInt = Integer::valueOf;
Function<String, Long> parseLong = Long::valueOf;
```

Kiểu ở bên trái cung cấp đủ thông tin để Java hiểu từng tham chiếu. Vấn đề thường xuất hiện khi lời gọi bao quanh cũng bị nạp chồng hoặc khi chưa xác định được kiểu đích.

Trong trường hợp đó, lambda giúp ghi rõ kiểu tham số hoặc lời gọi cụ thể và thường dễ đọc, dễ gỡ lỗi hơn một phép ép kiểu phức tạp quanh tham chiếu phương thức.
