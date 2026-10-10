Quy tắc không bị gán lại sau khi khởi tạo (effectively final) giới hạn việc gán lại biến cục bộ được bắt giữ. Nó không làm đối tượng mà biến tham chiếu tới trở thành bất biến.

```java
List<String> seen = new ArrayList<>();
Consumer<String> remember = value -> seen.add(value);
```

`seen` không bị gán lại nên có thể được lambda bắt giữ. Tuy nhiên, chính `ArrayList` vẫn bị thay đổi mỗi lần `remember` chạy.

Khác biệt này quan trọng vì trạng thái có thể thay đổi bị bắt giữ tạo ra phụ thuộc khó nhìn thấy. Kết quả có thể phụ thuộc vào các lần gọi trước, thứ tự thực thi hoặc truy cập đồng thời. Nếu hành vi cần giữ trạng thái, hãy thiết kế rõ ai sở hữu trạng thái đó thay vì cho rằng dùng lambda sẽ làm nó an toàn hơn.
