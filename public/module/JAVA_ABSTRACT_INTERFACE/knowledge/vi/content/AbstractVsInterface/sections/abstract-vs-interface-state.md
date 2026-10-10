Lớp trừu tượng có thể sở hữu trạng thái của đối tượng và định nghĩa hàm khởi tạo để thiết lập trạng thái chung:

```java
abstract class BasePayment {
    private final String provider;

    protected BasePayment(String provider) {
        this.provider = provider;
    }
}
```

Interface không có trường riêng cho từng đối tượng hay hàm khởi tạo. Mọi trường khai báo trong interface đều là `public static final`, nên chúng thuộc về chính interface thay vì tạo trạng thái riêng cho từng đối tượng.

Vì vậy nếu nhiều lớp con thật sự chia sẻ trạng thái, bất biến (invariant) và quy tắc khởi tạo chung, lớp trừu tượng thường là lựa chọn tự nhiên hơn.
