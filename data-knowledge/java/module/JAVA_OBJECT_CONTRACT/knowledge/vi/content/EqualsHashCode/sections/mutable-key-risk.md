Ngay cả khi cách cài đặt ban đầu đúng, việc thay đổi trạng thái dùng cho phép bằng nhau sau khi đưa khóa vào cấu trúc dữ liệu cũng có thể làm quy tắc tra cứu bị phá theo thời gian:

```text
equals/hashCode được cài đặt đúng
        +
trạng thái khóa có thể thay đổi
        ↓
tra cứu vẫn có thể thất bại
```

Nếu trường dữ liệu tham gia `equals`/`hashCode` thay đổi sau khi đối tượng đã được đưa vào `HashMap` hoặc `HashSet`, đối tượng vẫn nằm trong cấu trúc được thiết lập theo trạng thái cũ, còn lần tra cứu sau có thể đi theo một đường tìm kiếm khác vì mã băm mới.

Ví dụ:

```java
final class UserKey {
    String value;

    UserKey(String value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof UserKey that
                && Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}

UserKey key = new UserKey("U-100");
Set<UserKey> set = new HashSet<>();
set.add(key);

key.value = "U-200";

System.out.println(set.contains(key)); // có thể false
```

Mô hình tư duy:

```text
đưa vào cấu trúc dữ liệu
hash("U-100")
→ cấu trúc đặt/tìm theo đường băm A

thay đổi trạng thái khóa
hash("U-200")
→ lần tra cứu sau có thể đi theo đường băm B

đối tượng vẫn nằm theo cách sắp đặt cũ
```

Kết quả có thể là `contains/get/remove` không tìm thấy đối tượng dù đối tượng đó vẫn đang nằm trong cấu trúc dữ liệu.

### THỰC HÀNH AN TOÀN

Khóa tốt thường bất biến, hoặc ít nhất các trường dữ liệu liên quan tới phép bằng nhau và mã băm không thay đổi trong thời gian đối tượng đang được dùng làm khóa.

Vì vậy khi thiết kế lớp dùng làm khóa, câu hỏi không chỉ là “phương thức đã viết đúng chưa?” mà còn là:

> Trạng thái dùng để xác định phép bằng nhau có ổn định trong suốt thời gian đối tượng nằm trong cấu trúc dữ liệu không?

Sau phép bằng nhau và mã băm, chương tiếp theo chuyển sang một quy ước khác: **đối tượng nên tự mô tả mình ra sao cho con người, log và công cụ gỡ lỗi?**
