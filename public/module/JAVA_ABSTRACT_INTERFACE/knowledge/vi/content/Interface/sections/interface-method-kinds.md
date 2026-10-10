Interface hiện đại có thể chứa nhiều loại phương thức:

| Loại | Vai trò |
| --- | --- |
| phương thức abstract của đối tượng | phần hợp đồng mà cách triển khai phải cung cấp |
| phương thức `default` | hành vi mặc định của đối tượng có thể được kế thừa |
| phương thức `static` | hành vi thuộc chính kiểu interface |
| phương thức `private` | hỗ trợ nội bộ; có thể là phương thức của đối tượng hoặc `static` |

Một phương thức abstract của đối tượng không ghi từ khóa kiểm soát truy cập trong interface vẫn mặc nhiên là `public abstract`:

```java
interface PaymentMethod {
    void pay(int amount); // public abstract
}
```

Vì vậy lớp triển khai không được giảm mức truy cập:

```java
class CardPayment extends BasePayment implements PaymentMethod {
    @Override
    public void pay(int amount) {
        // phần triển khai
    }
}
```

Các loại phương thức trên có quy tắc gọi, kế thừa và ghi đè khác nhau. Ở đây chỉ cần nhận diện chúng; phần sau sẽ đi sâu vào `default`, `static` và `private`.
