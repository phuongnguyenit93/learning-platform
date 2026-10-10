### MỐI LIÊN HỆ — từ khóa kiểm soát truy cập giúp hiện thực hóa đóng gói như thế nào?

Đóng gói là **khái niệm thiết kế**: đối tượng phải kiểm soát được trạng thái và chi tiết triển khai nào được phép lộ ra ngoài.

Access modifier là một trong những **cơ chế của Java** giúp biến ranh giới thiết kế đó thành ràng buộc trong mã nguồn.

Java có bốn mức truy cập chính cho thành viên:

```text
private
→ chỉ class khai báo thành viên đó truy cập trực tiếp

package-private
→ các class trong cùng package có thể truy cập

protected
→ mở thêm quyền truy cập cho quan hệ kế thừa theo các quy tắc của Java

public
→ trở thành phần mà mã bên ngoài có thể truy cập và phụ thuộc
```

Có thể hình dung mối quan hệ như sau:

```text
Encapsulation
→ quyết định ranh giới nào nên tồn tại

Access Modifier
→ giúp Java thực thi một phần ranh giới đó
```

### VÌ SAO — `private` chưa đủ để tạo ra đóng gói tốt

Ví dụ:

```java
class Account {
    private int balance;

    public void setBalance(int balance) {
        this.balance = balance;
    }
}
```

Trường là `private`, nhưng `public setBalance(...)` vẫn cho phép bên ngoài đưa đối tượng vào trạng thái không hợp lệ.

Ngược lại:

```java
class Account {
    private int balance;

    public void withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalArgumentException("invalid withdrawal");
        }
        balance -= amount;
    }
}
```

Ở đây `private` giới hạn quyền truy cập trực tiếp, còn `withdraw(...)` tạo ra một **đường thay đổi trạng thái có kiểm soát**.

Vì vậy:

```text
private
≠
encapsulation

private + API có ranh giới hợp lý + quy tắc được bảo vệ
→ hỗ trợ đóng gói tốt hơn
```

### GHI CHÚ — tìm hiểu chi tiết kiểm soát truy cập ở đâu?

Phần này chỉ giải thích **mối quan hệ giữa Encapsulation và Access Modifier trong thiết kế OOP**.

Để học chi tiết các quy tắc của Java như `private`, package-private, `protected`, `public`, đặc biệt là `protected` khác package và phạm vi truy cập chính xác, hãy xem mô-đun **Class Object → Access Modifier**.
