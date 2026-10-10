Literal `null` tương thích với kiểu tham chiếu. Nếu các overload không có quan hệ “cụ thể hơn” rõ ràng:

```java
void print(String x) { }
void print(Integer x) { }

print(null); // mơ hồ
```

trình biên dịch không thể chọn một overload cụ thể.

Ép kiểu tường minh có thể loại bỏ sự mơ hồ nếu đó thực sự là ý định của mã.

Nếu các overload có quan hệ subtype rõ ràng, trình biên dịch vẫn có thể chọn phương thức cụ thể nhất:

```java
void print(Object x) { }
void print(String x) { }

print(null); // chọn String vì String cụ thể hơn Object
```

Vì vậy `null` không tự động gây mơ hồ; vấn đề chỉ xuất hiện khi không có ứng viên nào thắng rõ theo quy tắc chọn phương thức cụ thể nhất.
