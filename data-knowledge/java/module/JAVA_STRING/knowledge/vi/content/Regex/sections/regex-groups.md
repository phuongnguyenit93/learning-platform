Dấu ngoặc có thể tạo nhóm bắt giữ:

```regex
(\d+)-(\w+)
```

Sau khi so khớp thành công, `group(1)`, `group(2)` lấy phần văn bản được bắt giữ tương ứng.

Nếu chỉ cần nhóm mà không cần bắt giữ, nhóm không bắt giữ `(?:...)` có thể thể hiện mục đích rõ hơn.

Nhóm có tên cũng hữu ích khi Regex phức tạp và tên mang ý nghĩa nghiệp vụ.

```java
Pattern p = Pattern.compile(
        "(?<user>[a-z]+)@(?<domain>[a-z.]+)"
);
Matcher m = p.matcher("ada@example.com");

if (m.matches()) {
    m.group("user");   // ada
    m.group("domain"); // example.com
}
```

### group(0) và group(n)

Sau khi so khớp thành công:

```text
group(0)
→ toàn bộ phần khớp

group(1..n)
→ nhóm bắt giữ tương ứng
```

Gọi `group(...)` khi chưa có trạng thái so khớp thành công sẽ gây `IllegalStateException`.

### Chuỗi thay thế cũng có cú pháp riêng

Trong chuỗi thay thế của `replaceAll`/`Matcher.replaceAll`, `$` và `\` có ý nghĩa đặc biệt. Nếu phần thay thế phải được hiểu là văn bản literal khi chạy, dùng `Matcher.quoteReplacement(...)` khi phù hợp.
