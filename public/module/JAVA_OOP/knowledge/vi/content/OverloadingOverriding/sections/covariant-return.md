Phương thức ghi đè được phép trả về một **kiểu tham chiếu cụ thể hơn** so với kiểu trả về của phương thức ở class cha.

```java
class Parent {
    Animal create() { ... }
}

class Child extends Parent {
    @Override
    Dog create() { ... }
}
```

Vì `Dog` là kiểu con của `Animal`, hợp đồng của `Parent` vẫn được giữ. Bên gọi thông qua `Child` lại nhận được kiểu chính xác hơn.

Quy tắc này gọi là **kiểu trả về hiệp biến (covariant return type)**.

Kiểu nguyên thủy không có kiểu trả về hiệp biến theo nghĩa này.
