Với tham chiếu, `==` chỉ kiểm tra xem hai tham chiếu có cùng trỏ tới một đối tượng, hoặc cả hai cùng `null`, hay không.

```java
String a = new String("java");
String b = new String("java");
String same = a;

System.out.println(a == b);       // false
System.out.println(a == same);    // true
System.out.println(a.equals(b));  // true
```

### `Object.equals()` MẶC ĐỊNH LÀ GÌ?

Nếu lớp của bạn **không ghi đè (`override`) `equals`**, phần triển khai kế thừa từ `Object` sử dụng phép bằng nhau theo định danh.

```java
final class UserId {
    private final String value;

    UserId(String value) {
        this.value = value;
    }
}

UserId a = new UserId("U-100");
UserId b = new UserId("U-100");

System.out.println(a == b);       // false
System.out.println(a.equals(b));  // false: vẫn là Object.equals mặc định
```

Đây là lý do ta ghi đè `equals` khi nghiệp vụ cần phép bằng nhau về mặt logic: **mặc định Java không biết trường dữ liệu nào tạo nên ý nghĩa “bằng nhau” của lớp**.

### KHI NÀO `==` LÀ ĐÚNG?

`==` phù hợp khi ta thật sự quan tâm định danh, ví dụ:

- hằng enum;
- đối tượng đơn nhất (`singleton`);
- đối tượng đánh dấu (`sentinel`) dùng làm dấu hiệu đặc biệt;
- kiểm tra hai tham chiếu có đang chia sẻ đúng cùng một đối tượng hay không.

Nó thường không phù hợp cho đối tượng được nhận diện theo giá trị như `String`, giá trị tiền tệ hoặc đối tượng giá trị dùng làm ID.

> Lưu ý: chuỗi literal và biểu thức chuỗi hằng tại thời điểm biên dịch được intern theo semantics của Java, nên các literal bằng nhau có thể chủ đích cùng trỏ tới một instance trong **String pool**. Chuỗi được tạo ở thời gian chạy không tự động có bảo đảm đó. Dù vậy, `==` vẫn không phải cách đúng để so nội dung `String`.
