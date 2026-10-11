Trường khai báo trong interface mặc nhiên là:

```text
public static final
```

Ví dụ:

```java
interface Limits {
    int MAX_RETRY = 3;
}
```

`MAX_RETRY` trong ví dụ này là một biến hằng (constant variable) gắn với chính interface, không phải trạng thái riêng của từng đối tượng triển khai interface đó. Nói tổng quát hơn, mọi trường khai báo trong interface đều là `public static final`; chỉ những trường thỏa thêm quy tắc về biến hằng của Java mới là hằng tại thời điểm biên dịch (compile-time constant).

Trường trong interface phải có giá trị khởi tạo ngay tại khai báo. Đây là yêu cầu của khai báo field trong interface; các field này là `static final` và interface không dùng hàm khởi tạo đối tượng để gán chúng sau đó:

```java
interface InvalidLimits {
    int MAX_RETRY; // lỗi biên dịch: MAX_RETRY chưa được khởi tạo
}
```

`final` ngăn chính biến trường được gán một giá trị khác sau khi đã khởi tạo. Nếu giá trị của trường là một tham chiếu tới đối tượng có thể thay đổi thì đối tượng phía sau vẫn có thể đổi trạng thái. Vì vậy không nên dùng trường của interface để công khai trạng thái toàn cục có thể thay đổi.
