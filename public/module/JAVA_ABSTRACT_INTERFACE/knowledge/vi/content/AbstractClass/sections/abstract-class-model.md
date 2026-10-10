### KHÁI NIỆM

Một `abstract class` là lớp **không thể tạo đối tượng trực tiếp**, nhưng vẫn có thể chứa:

- trạng thái của đối tượng qua trường (field);
- hàm khởi tạo (constructor);
- phương thức có phần thân;
- phương thức `abstract` không có phần thân.

Một lớp được khai báo `abstract` cũng **không bắt buộc** phải có phương thức `abstract`. Từ khóa `abstract` trên lớp trước hết nói rằng lớp đó chưa phải một kiểu có thể được khởi tạo trực tiếp.

Vì vậy lớp trừu tượng thường đóng vai trò **khung triển khai một phần** cho một nhóm lớp có quan hệ gần nhau.

```java
abstract class BasePayment {
    private final String provider;

    protected BasePayment(String provider) {
        this.provider = provider;
    }

    String provider() {
        return provider;
    }

    public abstract void pay(int amount);
}
```

`BasePayment` giữ trạng thái chung là `provider`, cung cấp hành vi `provider()` và buộc lớp con hoàn thiện `pay(...)`.

### VÌ SAO

Nếu nhiều lớp có chung trạng thái, quy tắc khởi tạo, bất biến (invariant) và một số hành vi nền tảng, sao chép các phần đó sang từng lớp sẽ tạo trùng lặp và làm quy tắc chung khó duy trì. Lớp trừu tượng giữ phần dùng chung ở một nơi nhưng vẫn để lại những điểm mở mà lớp con phải hoàn thiện.

Trong chương sau, `PaymentMethod` sẽ được đặt phía trên để tách **hợp đồng mà bên sử dụng phụ thuộc** khỏi **phần triển khai chung** mà một nhánh lớp muốn tái sử dụng.
