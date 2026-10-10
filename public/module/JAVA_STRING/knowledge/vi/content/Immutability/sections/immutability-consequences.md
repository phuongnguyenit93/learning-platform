String bất biến chỉ đảm bảo **bản thân giá trị String không bị thay đổi**. Vì vậy cùng một đối tượng String thường có thể được chia sẻ an toàn về mặt nội dung, nhưng điều đó không làm đối tượng chứa String trở thành bất biến hoặc tự động an toàn luồng.

```java
List<String> names = new ArrayList<>();
names.add("Ada");
```

```text
giá trị phần tử String
→ bất biến

cấu trúc List<String>
→ vẫn có thể thêm/xóa/đổi thứ tự

an toàn luồng của List
→ là câu hỏi riêng, không được suy ra từ tính bất biến của String
```

Điều này cũng giải thích vì sao String phù hợp làm khóa trong `HashMap`: nội dung dùng cho `equals/hashCode` không đổi sau khi đối tượng được tạo.

### Bất biến khác `final`

`final` áp vào biến/tham chiếu; tính bất biến áp vào đối tượng:

```java
String a = "java";
a = "kotlin"; // hợp lệ

final String b = "java";
// b = "kotlin"; // compile error
```

```text
đối tượng bất biến
→ đối tượng không đổi trạng thái logic

biến final
→ biến không được gán giá trị/tham chiếu mới sau khi đã gán
```
