`split` biến một String thành nhiều phần, còn `String.join` ghép nhiều phần bằng dấu phân cách:

```java
String csv = "red,green,blue";
String[] colors = csv.split(",");

String path = String.join("/", "api", "users", "42");
// "api/users/42"
```

Điểm quan trọng: tham số của `String.split(...)` là **biểu thức chính quy**, không phải luôn là một dấu phân cách cố định.

```java
"a.b.c".split("\\.");
```

Ở đây cần xử lý ký tự thoát (escape) ở cả tầng Java String literal lẫn tầng ký tự đặc biệt của Regex. Chương Regex sẽ giải thích hai tầng này kỹ hơn.

Nếu dấu phân cách chỉ là một chuỗi cố định nhưng lại có ý nghĩa đặc biệt trong Regex, hãy chủ động dùng `Pattern.quote(...)` hoặc API phù hợp thay vì đoán cách viết ký tự thoát.

### split(regex, limit) thay đổi cách giữ phần tử

`split(regex)` có hành vi tương đương `split(regex, 0)`: Regex được áp dụng nhiều lần và các chuỗi rỗng ở cuối bị loại:

```java
System.out.println("a,b,".split(",").length);    // 2
System.out.println("a,b,".split(",", 0).length); // 2
```

Khi `limit < 0`, Regex được áp dụng nhiều lần mà không có giới hạn dương và các chuỗi rỗng ở cuối được giữ lại:

```java
System.out.println("a,b,".split(",", -1).length); // 3
```

Khi `limit > 0`, kết quả có tối đa `limit` phần tử, nên Regex chỉ được áp dụng nhiều nhất `limit - 1` lần. Phần tử cuối giữ phần đầu vào còn lại:

```java
Arrays.toString("a,b,c,d".split(",", 2));
// [a, b,c,d]

Arrays.toString("a,b,c,d".split(",", 3));
// [a, b, c,d]
```

Mô hình tư duy:

```text
limit > 0
→ tối đa limit phần tử
→ phần tử cuối giữ phần còn lại

limit == 0
→ split không giới hạn dương
→ bỏ các chuỗi rỗng ở cuối

limit < 0
→ split không giới hạn dương
→ giữ các chuỗi rỗng ở cuối
```

`limit` là một phần của hợp đồng phân tích dữ liệu, không chỉ là tùy chọn hiệu năng. Nếu trường rỗng ở cuối hay phần dữ liệu còn lại có ý nghĩa, hãy chọn overload có chủ ý.

Điều này cũng cho thấy CSV thật có thể cần bộ phân tích riêng vì trường có dấu nháy và quy tắc ký tự thoát phức tạp hơn một dấu phân cách đơn giản.
