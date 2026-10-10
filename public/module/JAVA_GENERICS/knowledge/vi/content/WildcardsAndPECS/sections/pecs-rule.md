Hãy hỏi tham số đang làm gì với giá trị kiểu `T`:

```text
tham số chủ yếu CUNG CẤP T cho phương thức đọc
→ ? extends T

tham số chủ yếu TIẾP NHẬN T do phương thức ghi vào
→ ? super T

tham số cần vừa đọc chính xác T vừa ghi T,
hoặc nhiều vị trí phải giữ cùng một quan hệ kiểu
→ thường dùng kiểu chính xác hoặc tham số kiểu có tên
```

Ví dụ copy:

```java
static <T> void copy(
        List<? extends T> source,
        List<? super T> target) {
    for (T value : source) {
        target.add(value);
    }
}
```
