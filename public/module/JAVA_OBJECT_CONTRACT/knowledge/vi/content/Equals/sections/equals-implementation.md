Một cách cài đặt cho đối tượng giá trị thường đi theo luồng sau:

```text
1. cùng định danh?                  → true ngay
2. other có kiểu dữ liệu phù hợp?   → nếu không, false
3. so sánh trạng thái liên quan     → kết quả bằng nhau về mặt logic
```

Ví dụ:

```java
import java.util.Objects;

final class UserId {
    private final String value;

    UserId(String value) {
        this.value = Objects.requireNonNull(value);
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof UserId that)) return false;
        return Objects.equals(value, that.value);
    }
}
```

> Đoạn mã này cố ý chỉ tập trung vào `equals`. Một kiểu dữ liệu giá trị hoàn chỉnh khi ghi đè `equals` còn phải cung cấp `hashCode` sao cho mọi đối tượng bằng nhau luôn tạo cùng mã băm; hai chương tiếp theo sẽ ghép đầy đủ phần quy ước đó.

### GHI ĐÈ (OVERRIDE), ĐỪNG VÔ TÌNH NẠP CHỒNG (OVERLOAD)

Chữ ký phương thức mà `Object` quy định là:

```java
public boolean equals(Object other)
```

Nếu viết:

```java
public boolean equals(UserId other) {
    ...
}
```

thì đó là **nạp chồng (overload)**, không phải **ghi đè (override)**. Đoạn mã gọi qua `Object`, cấu trúc dữ liệu hoặc API chuẩn vẫn có thể dùng `Object.equals()` thay vì phương thức bạn tưởng đã thay thế.

Vì vậy nên luôn dùng `@Override`:

```java
@Override
public boolean equals(Object other) {
    ...
}
```

Trình biên dịch sẽ giúp bắt lỗi chữ ký phương thức ngay tại chỗ.

### TRƯỜNG DỮ LIỆU NÀO NÊN THAM GIA PHÉP BẰNG NHAU?

Không có quy tắc “mọi trường dữ liệu đều phải so sánh”. Hãy hỏi:

> Trường dữ liệu nào thực sự xác định hai đối tượng là cùng giá trị hoặc cùng thực thể theo nghiệp vụ?

Ví dụ `User` có thể có:

```text
userId       → định danh nghiệp vụ ổn định
displayName  → trạng thái hiển thị có thể thay đổi
lastLoginAt  → trạng thái vận hành
```

Nếu phép bằng nhau của `User` đại diện định danh nghiệp vụ, việc đưa `lastLoginAt` vào phép so sánh có thể làm cùng một người dùng trở thành “khác nhau” chỉ vì vừa đăng nhập.

### TRẠNG THÁI XÁC ĐỊNH BẰNG NHAU CÓ THỂ THAY ĐỔI

Quy tắc **nhất quán** của `equals` yêu cầu các lần so sánh lặp lại phải cho cùng kết quả **khi trạng thái liên quan tới phép bằng nhau không đổi**. Nó không có nghĩa là một đối tượng đã thay đổi chính trạng thái đó vẫn phải trả kết quả cũ.

Ví dụ nếu phép bằng nhau phụ thuộc vào trường `email` có thể thay đổi:

```text
trước khi thay đổi
user.email = "a@example.com"
→ user có thể bằng một đối tượng khác có cùng email

sau khi thay đổi
user.email = "b@example.com"
→ kết quả bằng nhau có thể thay đổi một cách hợp lệ
```

Vì vậy rủi ro thiết kế không phải là “có thay đổi trạng thái thì `equals` tự động sai quy tắc”. Rủi ro nằm ở việc **ý nghĩa đối tượng đang đại diện cho giá trị/thực thể logic nào có thể thay đổi theo thời gian**, khiến việc suy luận, loại bỏ phần tử trùng, lưu đệm và sử dụng đối tượng làm khóa về sau khó giữ ổn định.

Nên ưu tiên trạng thái xác định bằng nhau đủ ổn định trong suốt khoảng thời gian đoạn mã sử dụng dựa vào ý nghĩa định danh/giá trị đó. Chương `equals/hashCode` phía sau sẽ cho thấy lỗi đặc biệt dễ quan sát khi trạng thái dùng cho phép bằng nhau và mã băm bị thay đổi sau khi đối tượng đã được đưa vào cấu trúc dữ liệu dựa trên mã băm.

### `instanceof` HAY `getClass()`?

Hai lựa chọn thể hiện hai chính sách khác nhau.

```java
if (!(other instanceof UserId that)) return false;
```

cho phép kiểu con tương thích tham gia phép bằng nhau, còn:

```java
if (other == null || getClass() != other.getClass()) return false;
```

yêu cầu đúng chính xác lớp thực tế tại thời điểm chạy.

Không có một lựa chọn máy móc đúng cho mọi cây kế thừa. Điều quan trọng là chính sách phải giữ tính đối xứng, bắc cầu và phù hợp với nghiệp vụ. Với đối tượng giá trị, lớp `final` hoặc hệ phân cấp đóng thường giúp quy tắc này dễ duy trì hơn.

### `equals` VÀ NULL

Với một tham chiếu `x` khác `null`:

```java
x.equals(null) // phải false
```

Nhưng gọi phương thức trên chính tham chiếu `null` sẽ thất bại trước khi vào `equals`:

```java
UserId x = null;
x.equals(other); // NullPointerException
```

Khi cần so sánh an toàn với `null`, `Objects.equals(a, b)` là một phương thức hỗ trợ hữu ích.
