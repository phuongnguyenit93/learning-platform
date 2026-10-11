Kế thừa có thể làm một giao diện nhìn như có nhiều phương thức trừu tượng, nhưng các khai báo đó vẫn có thể mô tả cùng một thao tác nếu chúng tương thích theo quy tắc ghi đè (override) của Java.

```java
interface Left {
    CharSequence value();
}

interface Right {
    String value();
}

@FunctionalInterface
interface Combined extends Left, Right {
}
```

`String` là kiểu trả về hiệp biến phù hợp với `CharSequence`, nên hai khai báo `value()` có thể hợp thành một hợp đồng tương thích. Lambda nhắm tới `Combined` vẫn chỉ cần cung cấp một hành vi `value`.

Ngược lại, các phương thức trừu tượng không liên quan như `read()` và `write()` không tự hợp thành một SAM. Các khai báo kế thừa có chữ ký hoặc kiểu trả về không thể tạo quan hệ ghi đè hợp lệ cũng khiến giao diện không còn là giao diện hàm.

Vì vậy, "đếm số phương thức trừu tượng nhìn thấy trong mã nguồn" chỉ là mẹo ban đầu, không phải quy tắc đầy đủ.
