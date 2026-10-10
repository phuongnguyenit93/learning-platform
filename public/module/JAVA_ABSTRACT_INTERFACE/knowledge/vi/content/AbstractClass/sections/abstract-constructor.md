Một lớp trừu tượng không thể được `new` trực tiếp, nhưng hàm khởi tạo của nó **vẫn chạy** khi tạo đối tượng của lớp con cụ thể:

```java
class CardPayment extends BasePayment {
    CardPayment() {
        super("card");
    }

    @Override
    public void pay(int amount) { ... }
}
```

Hàm khởi tạo của `BasePayment` không được lớp con “kế thừa”. Nó được gọi trong chuỗi khởi tạo để thiết lập phần trạng thái thuộc `BasePayment` của đối tượng `CardPayment` trước khi quá trình khởi tạo lớp con hoàn tất.

### GIỚI HẠN

Không nên gọi phương thức có thể bị ghi đè từ hàm khởi tạo nếu không có lý do rất mạnh. Khi đó phần triển khai của lớp con có thể chạy trước khi trạng thái riêng của lớp con được khởi tạo đầy đủ.
