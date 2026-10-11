Đây cũng là **phần nâng cao về lúc chạy**. Ở lượt đầu, chỉ cần nhớ quy tắc thực tế: JVM không phải lúc nào cũng kiểm tra được type argument cụ thể; vì thế mảng generic, phép ép kiểu và một số kiểm tra runtime có giới hạn.

**Reifiable type** là kiểu có đủ thông tin biểu diễn ở runtime cho các thao tác cần kiểm tra kiểu lúc chạy.

Ví dụ reifiable:

```text
String
List
List<?>
int
String[]
List<?>[]
```

Ví dụ non-reifiable:

```text
List<String>
List<Integer>
T
List<String>[]
```

Reifiability quan trọng với những thao tác phụ thuộc vào thông tin kiểu ở runtime, đặc biệt là tạo mảng và các runtime type check. Riêng với phép ép kiểu, **target non-reifiable có thể dẫn tới unchecked cast chính vì JVM không thể xác minh đầy đủ generic target đó**. Generic varargs cũng có thể tạo ranh giới tương tự, nơi compiler không chứng minh được toàn bộ quan hệ kiểu và heap pollution có thể xuất hiện.

### Ghi chú nâng cao — `instanceof` với parameterized type từ Java 16+

Không nên học thuộc quy tắc quá rộng rằng “parameterized type không bao giờ được xuất hiện sau `instanceof`”. Ví dụ sau hợp lệ:

```java
List<Integer> values = new ArrayList<>();

if (values instanceof ArrayList<Integer>) {
    // hợp lệ
}
```

Điều này **không** có nghĩa JVM vừa kiểm tra từng phần tử có phải `Integer` hay không. Kiểu tĩnh `List<Integer>` đã mang ràng buộc `Integer`; phép `instanceof` ở đây chỉ thu hẹp class lúc chạy từ `List` sang `ArrayList`.

Từ Java 16+, `instanceof` có thể dùng một số parameterized type khi tồn tại phép ép kiểu có thể kiểm tra (checked casting conversion) từ kiểu tĩnh của biểu thức sang kiểu được kiểm tra. Vì vậy `non-reifiable` **không đồng nghĩa** với “luôn bị cấm sau `instanceof`”.

Một unchecked cast có thể biên dịch được nhưng compiler không thể kiểm tra đầy đủ type argument ở runtime:

```java
List<String> names = (List<String>) value;
```

Vì vậy unchecked cast phải được xem như một **ranh giới tin cậy**, không phải bằng chứng rằng JVM đã kiểm tra đầy đủ generic argument.

Erasure giải thích nhiều giới hạn tưởng như rời rạc của Generics. Chương cuối gom các giới hạn quan trọng và chỉ ra cách thiết kế thay thế an toàn.
