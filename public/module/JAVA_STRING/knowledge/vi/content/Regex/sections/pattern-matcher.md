Java tách mẫu đã biên dịch và trạng thái so khớp:

```java
Pattern pattern = Pattern.compile("(\\d+)-(\\w+)");
Matcher matcher = pattern.matcher(input);
```

`Pattern` mô tả Regex đã được biên dịch; `Matcher` gắn mẫu đó với một đầu vào cụ thể và giữ trạng thái tìm kiếm/so khớp.

Biên dịch lại cùng Regex trong một vòng lặp nóng có thể tốn chi phí không cần thiết; có thể tái sử dụng `Pattern` khi phù hợp.

### Pattern và Matcher có vai trò khác nhau

```text
Regex trong mã nguồn
    ↓ biên dịch
Pattern
    ↓ matcher(input)
Matcher
    ↓ thực thi/tìm kiếm + giữ trạng thái so khớp
```

`Pattern` bất biến và có thể dùng chung; `Matcher` giữ trạng thái so khớp có thể thay đổi nên thường tạo theo từng đầu vào/lần sử dụng.

### matches, lookingAt và find

Ba thao tác trả lời ba câu hỏi khác nhau:

```java
Pattern digits = Pattern.compile("\\d+");
String input = "123 abc 456";

digits.matcher(input).matches();   // toàn bộ đầu vào có khớp mẫu?
digits.matcher(input).lookingAt(); // đầu vào có bắt đầu bằng phần khớp?

Matcher finder = digits.matcher(input);
while (finder.find()) {
    String match = finder.group();
}
```

```text
kiểm tra toàn chuỗi
→ matches

mẫu ở đầu chuỗi
→ lookingAt

tìm kiếm/trích xuất nhiều phần khớp
→ find
```
