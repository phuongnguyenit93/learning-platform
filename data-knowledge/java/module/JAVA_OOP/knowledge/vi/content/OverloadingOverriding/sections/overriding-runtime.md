### KHÁI NIỆM

Ghi đè xảy ra khi class con cung cấp phần triển khai mới cho một phương thức đối tượng được kế thừa từ class cha với chữ ký tương thích.

Trong Java, tư duy ghi đè cũng áp dụng khi một class cung cấp phần triển khai cho hợp đồng phương thức đối tượng kế thừa từ `interface` hoặc ghi đè một phương thức `default`. Mô-đun `abstract-interface` sở hữu các quy tắc chi tiết của `interface`; ở đây trọng tâm vẫn là **phần triển khai của phương thức đối tượng được chọn động lúc chạy**.

```java
class Parent {
    String call() { return "Parent"; }
}

class Child extends Parent {
    @Override
    String call() { return "Child"; }
}
```

### CƠ CHẾ

Trình biên dịch trước tiên xác định rằng lời gọi hợp lệ với phương thức `call()`.

Khi chạy, nếu đối tượng thực tế là `Child`, cơ chế phân phối động chọn phần triển khai của `Child`.

Đây là lý do một biến có kiểu `Parent` vẫn có thể biểu hiện hành vi của `Child`.
