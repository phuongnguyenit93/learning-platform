Hai cơ chế rất dễ nhầm:

```text
nạp chồng: chọn phương thức
→ thời điểm biên dịch
→ dựa trên tập phương thức + kiểu đối số/chuyển đổi lúc biên dịch

ghi đè: phân phối lời gọi
→ thời điểm chạy
→ dựa trên kiểu thực tế của receiver sau khi chữ ký đã được xác định
```

Ví dụ `Parent x = new Child()` có thể chọn overload theo kiểu khai báo `Parent` nhưng gọi thân phương thức instance đã ghi đè của `Child`.

Mô-đun OOP sẽ đi sâu hơn vào phân phối lời gọi động; ở đây chỉ cần khóa mô hình tư duy lúc biên dịch so với lúc chạy.

Ví dụ nối hai giai đoạn:

```java
class Parent {
    void speak() { System.out.println("Parent"); }
}

class Child extends Parent {
    @Override
    void speak() { System.out.println("Child"); }
}

void use(Parent x) { x.speak(); }
void use(Object x) { System.out.println("Object"); }

Parent p = new Child();
use(p);
```

Trình biên dịch chọn `use(Parent)` dựa trên kiểu tĩnh của `p`. Bên trong phương thức, lời gọi `x.speak()` được phân phối ở thời điểm chạy tới `Child.speak()` vì đối tượng nhận lời gọi thực tế là `Child`.

```text
thời điểm biên dịch: chọn chữ ký
        ↓
thời điểm chạy: phân phối tới thân phương thức đã ghi đè
```
