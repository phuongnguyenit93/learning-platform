Lời gọi phương thức của đối tượng vẫn chọn cách triển khai theo kiểu thực tế ngay cả khi đang ở trong hàm khởi tạo.

Nếu hàm khởi tạo của lớp cha gọi một phương thức có thể bị ghi đè, cách triển khai ở lớp con có thể chạy **trước khi trạng thái của lớp con được khởi tạo đầy đủ**.

```java
class Parent {
    Parent() { print(); }
    void print() { }
}

class Child extends Parent {
    private String value = "ready";
    @Override void print() { System.out.println(value); }
}
```

`print()` có thể nhìn thấy `value == null` khi được gọi từ `Parent()`.

Nguyên tắc an toàn: tránh gọi phương thức có thể bị ghi đè từ hàm khởi tạo.
