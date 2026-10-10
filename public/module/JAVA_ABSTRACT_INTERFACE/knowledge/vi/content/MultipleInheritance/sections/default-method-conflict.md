Nếu hai interface không có quan hệ kế thừa cung cấp cùng một phương thức `default`:

```java
interface A {
    default String name() { return "A"; }
}

interface B {
    default String name() { return "B"; }
}
```

Nếu phía lớp chưa có một phương thức cụ thể tương thích đã giải quyết chữ ký này, lớp triển khai cả `A` và `B` phải override `name()` để tự quyết định hành vi.

Java không tự đoán default nào “đúng hơn” khi không có interface nào cụ thể hơn interface còn lại.

Ngược lại, nếu interface con override phương thức `default` của interface cha, khai báo ở interface con cụ thể hơn:

```java
interface Parent {
    default String name() { return "parent"; }
}

interface Child extends Parent {
    @Override
    default String name() { return "child"; }
}
```

Một lớp chỉ triển khai `Child` không phải chọn lại giữa `Parent.name()` và `Child.name()`; `Child` đã cung cấp hành vi cụ thể hơn.

Xung đột cũng có thể xuất hiện ngay trong **hệ phân cấp interface**, chưa cần có lớp triển khai. Nếu một interface con kế thừa hai phương thức `default` có chữ ký tương đương từ hai interface cha không có quan hệ cụ thể-hơn với nhau, interface con phải tự khai báo một phương thức override để giải quyết; nếu không, khai báo interface con bị lỗi biên dịch:

```java
interface Left {
    default String name() { return "left"; }
}

interface Right {
    default String name() { return "right"; }
}

interface Combined extends Left, Right {
    @Override
    default String name() {
        return Left.super.name();
    }
}
```

Việc giải quyết ở interface con làm hợp đồng trở nên rõ ràng trước khi bất kỳ lớp nào triển khai `Combined`.
