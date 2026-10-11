`instanceof` cho phép kiểm tra kiểu thực tế trước khi downcast. Pattern matching còn có thể gộp kiểm tra và tạo biến ràng buộc:

```java
if (animal instanceof Dog dog) {
    dog.bark();
}
```

Tuy nhiên nếu mã phải dùng `instanceof` liên tục để chọn hành vi theo kiểu con, hãy kiểm tra lại thiết kế trừu tượng/đa hình.

`instanceof` với `null` luôn cho `false`, vì `null` không phải instance của lớp nào:

```java
Object value = null;
System.out.println(value instanceof String); // false
```

Biến pattern chỉ tồn tại trong vùng mà trình biên dịch biết kiểm tra đã thành công, giúp tránh ép kiểu lặp lại và giảm lệch giữa bước kiểm tra với bước ép kiểu.

### Pattern matching không chỉ thay thế ép kiểu tường minh

Điểm quan trọng hơn cú pháp ngắn là trình biên dịch liên kết **kiểm tra kiểu + ràng buộc biến + luồng điều khiển**:

```java
if (animal instanceof Dog dog && dog.isReady()) {
    dog.bark();
}
```

`dog` dùng được ở vế phải của `&&` vì vế đó chỉ chạy sau khi `animal instanceof Dog dog` thành công.

Guard clause cũng có thể làm biến pattern tồn tại ở phần mã phía sau khi nhánh thất bại đã thoát:

```java
if (!(value instanceof String text)) {
    return;
}

System.out.println(text.length());
```

Ở dòng cuối, trình biên dịch biết chương trình chỉ có thể đi tiếp khi pattern đã khớp.

Ngược lại, biến pattern không thể dùng ở nơi trình biên dịch không bảo đảm pattern đã khớp. Chi tiết phạm vi theo luồng được nối với chương Biến và phạm vi; ở đây mô hình cần giữ là:

```text
kiểm tra kiểu lúc chạy thành công
        ↓
trình biên dịch cho phép biến ràng buộc có kiểu
        ↓
biến chỉ tồn tại nơi kết quả thành công được bảo đảm
```

### Java 21: `switch` có thể khớp theo type pattern

Sau khi đã có mô hình về kiểu tĩnh, kiểu lúc chạy và biến pattern, có thể đọc đầy đủ pattern matching trong `switch`. Với Java 21, `switch` không còn chỉ so giá trị chọn (selector) với hằng; giá trị chọn kiểu tham chiếu có thể được khớp bằng type pattern:

```java
static String describe(Object value) {
    return switch (value) {
        case Integer i -> "integer: " + i;
        case String s -> "string: " + s;
        case null -> "null";
        default -> "other";
    };
}
```

Mô hình tư duy:

```text
giá trị chọn của switch
→ khớp hằng/enum/String khi phù hợp
→ khớp type pattern với giá trị tham chiếu
→ tạo biến pattern khi case khớp
→ có thể xử lý null bằng case null rõ ràng
```

`case Integer i` vừa kiểm tra kiểu thực tế vừa tạo biến `i` có kiểu tĩnh `Integer` trong `case` đó. Đây là cùng họ cơ chế với `instanceof Integer i`, nhưng được dùng trong bảng quyết định của `switch`.

Nếu giá trị chọn kiểu tham chiếu có thể là `null`, hãy xem `null` là một phần của hợp đồng. `case null` cho phép xử lý rõ ràng; nếu không có nhánh `case` phù hợp cho `null` thì việc `switch` trên `null` có thể thất bại thay vì tự chạy `default`.

Không cần biến mọi chuỗi `if/else instanceof` thành pattern `switch`. Dùng nó khi nhiều nhánh cùng phân loại một giá trị chọn và `switch` làm mô hình quyết định rõ hơn.
