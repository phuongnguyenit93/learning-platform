Không phải cứ class con có phương thức cùng tên là ghi đè.

| Trường hợp | Có ghi đè được phân phối lúc chạy? | Ghi nhớ |
| --- | --- | --- |
| Phương thức đối tượng được kế thừa, có thể ghi đè và có chữ ký tương thích | Có | Phân phối động |
| Phương thức đối tượng `final` | Không | Class con không được ghi đè |
| Phương thức `private` | Không | Không phải phương thức được kế thừa để ghi đè |
| Phương thức `static` ở kiểu con có cùng chữ ký với phương thức `static` được kế thừa từ kiểu cha | Không | Đây là che khuất phương thức |

Ngoài ra:

- phương thức ghi đè không được giảm mức truy cập của phương thức cha;
- checked exception phải tuân quy tắc tương thích;
- nên dùng `@Override` để trình biên dịch kiểm tra giúp quan hệ ghi đè.

### CỤ THỂ HÓA — phạm vi truy cập, kiểu trả về và checked exception

Override không được giảm mức truy cập:

```java
class Parent {
    public Number value() { return 1; }
}

class Child extends Parent {
    @Override
    protected Number value() { return 2; } // lỗi biên dịch
}
```

Kiểu trả về tham chiếu có thể hiệp biến:

```java
class Parent {
    Number value() { return 1; }
}

class Child extends Parent {
    @Override
    Integer value() { return 2; } // OK
}
```

Với checked exception, phương thức ghi đè có thể giữ nguyên, thu hẹp hoặc bỏ exception đã khai báo, nhưng không được mở rộng thành checked exception rộng hơn hợp đồng cha:

```java
class Parent {
    void load() throws IOException {}
}

class Child extends Parent {
    @Override
    void load() throws FileNotFoundException {} // OK
}
```

`throws Exception` trong `Child.load()` ở ví dụ này sẽ không hợp lệ vì làm bên gọi của hợp đồng `Parent` phải đối mặt với một checked exception rộng hơn.

### PHÂN LOẠI — các thành viên thường bị nhầm với ghi đè

```text
phương thức private
→ không phải mục tiêu ghi đè được kế thừa

phương thức đối tượng final
→ có thể được kế thừa nhưng không được ghi đè

phương thức static được kế thừa
→ phương thức static cùng chữ ký ở kiểu con là che khuất, không phải ghi đè lúc chạy

hàm khởi tạo
→ không được kế thừa, không bị ghi đè
```

Ngoài ra Java không cho đổi một phương thức `static` thành phương thức đối tượng hoặc ngược lại trong kiểu con với cùng chữ ký. Đây là xung đột lúc biên dịch, không phải một biến thể của ghi đè.
