Một số giá trị kiểu bao có thể được cache, khiến ví dụ dùng `==` đôi khi cho kết quả bất ngờ:

```java
Integer a = 100;
Integer b = 100;
a == b // true: 100 nằm trong khoảng cache bắt buộc
```

nhưng với giá trị khác:

```java
Integer x = 1000;
Integer y = 1000;
x == y // không nên dựa vào kết quả tính đồng nhất
```

Khi muốn so sánh giá trị kiểu bao, dùng `equals` hoặc mở hộp theo hợp đồng phù hợp; không dựa vào tính đồng nhất do cache.

Đặc biệt, với `Integer`, Java bảo đảm cache ít nhất cho khoảng `-128..127` khi boxing theo các API/quy tắc chuẩn liên quan. Tuy nhiên mã nghiệp vụ không nên phụ thuộc vào tính đồng nhất do cache:

```java
Integer a = 100;
Integer b = 100;
System.out.println(a == b);      // true theo cache bắt buộc
System.out.println(a.equals(b)); // true theo giá trị
```

Mô hình tư duy đúng là: kiểu bao là đối tượng có ngữ nghĩa giá trị; `==` trên hai tham chiếu kiểm tra tính đồng nhất, không phải so sánh bằng theo giá trị số.
