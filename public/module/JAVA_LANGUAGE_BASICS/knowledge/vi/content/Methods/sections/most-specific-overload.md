Nếu nhiều ứng viên cùng áp dụng, trình biên dịch cố chọn phương thức **cụ thể hơn** theo các quy tắc về kiểu.

```java
void print(Object x) { }
void print(String x) { }

print("java"); // chọn overload nhận String
```

Không phải “phương thức khai báo sau” hay “phương thức có thân tốt hơn” sẽ thắng; đây là quyết định ở thời điểm biên dịch dựa trên kiểu.

Nếu trình biên dịch không thể tìm một ứng viên hợp lệ cụ thể hơn, lời gọi sẽ trở nên mơ hồ thay vì “chọn đại”:

```java
void use(CharSequence x) { }
void use(Serializable x) { }

String value = "x";
// use(value); // mơ hồ vì String phù hợp cả hai và không overload nào cụ thể hơn overload kia
```
