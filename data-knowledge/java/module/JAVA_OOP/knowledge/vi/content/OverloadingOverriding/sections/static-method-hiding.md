Phương thức `static` thuộc về kiểu/class chứ không tham gia phân phối động theo đối tượng thực tế lúc chạy như phương thức đối tượng.

```java
class Parent {
    static String call() { return "Parent"; }
}

class Child extends Parent {
    static String call() { return "Child"; }
}

Parent value = new Child();
value.call(); // Parent.call()
```

Việc chọn phương thức `static` đi theo kiểu được biết lúc biên dịch của biểu thức `value`, tức là `Parent`.

Gọi phương thức `static` thông qua đối tượng có thể biên dịch được trong một số trường hợp nhưng dễ gây hiểu nhầm. Nên gọi bằng tên class để ý nghĩa rõ ràng hơn.

`super.someMethod()` là một lời gọi **được chỉ định rõ phần triển khai của kiểu cha**, nên nó không có ý nghĩa giống lời gọi động thông thường qua `this.someMethod()`. `super` thường được dùng khi phương thức ghi đè muốn mở rộng thay vì thay thế hoàn toàn hành vi cha.
