### KHÁI NIỆM

Nạp chồng xảy ra khi nhiều phương thức có cùng tên nhưng khác danh sách tham số.

```java
String select(Parent value) { return "Parent"; }
String select(Child value)  { return "Child"; }
```

### CƠ CHẾ — trình biên dịch chọn phương thức nạp chồng nào?

Trình biên dịch dựa vào **kiểu đã biết tại thời điểm biên dịch của đối số** cùng với các quy tắc chuyển đổi tham số để chọn chữ ký phương thức phù hợp.

```java
Parent value = new Child();
select(value); // select(Parent)
```

Mặc dù đối tượng thực tế lúc chạy là `Child`, biến `value` có kiểu khai báo là `Parent`. Vì vậy phiên bản nạp chồng `select(Parent)` được chọn khi biên dịch.

Java không chờ tới lúc chạy rồi chọn lại phiên bản nạp chồng dựa trên class thực tế của đối tượng.

### RANH GIỚI — phần này không thay thế toàn bộ quy tắc phân giải nạp chồng

Mục tiêu ở OOP là phân biệt **lựa chọn nạp chồng lúc biên dịch** với **phân phối phương thức ghi đè lúc chạy**. Các quy tắc chi tiết như widening, boxing, varargs, phương thức cụ thể nhất và trường hợp mơ hồ thuộc `language-basics → Methods`.

### MINH CHỨNG — `DispatchController#overloadVsOverride()`

Cùng một biến:

```java
Parent x = new Child();
```

cho ra hai cơ chế khác nhau:

```text
select(x)
→ nhìn kiểu lúc biên dịch là Parent
→ gọi select(Parent)

x.call()
→ đối tượng thực tế là Child
→ chạy Child.call()
```

Đây là sự khác biệt quan trọng nhất cần ghi nhớ giữa overloading và overriding.
