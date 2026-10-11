Interface con có thể khai báo lại một phương thức được kế thừa để:

- bổ sung tài liệu hoặc annotation;
- thu hẹp kiểu trả về theo quy tắc kiểu trả về đồng biến (covariant return);
- làm rõ hơn hợp đồng mà interface con muốn công khai.

Ví dụ:

```java
interface Base {
    Number value();
}

interface Specific extends Base {
    @Override
    Integer value();
}
```

`Integer` là kiểu trả về hẹp hơn nhưng vẫn tương thích với `Number`, nên `Specific` có thể tinh chỉnh hợp đồng theo cách này.

Không nên khai báo lại chỉ để lặp lại cùng một chữ ký mà không bổ sung ý nghĩa. Mục tiêu là làm hợp đồng rõ hơn, không tạo thêm nhiễu.

Bước tiếp theo giải thích vì sao interface hiện đại có phương thức `default`, `static` và `private`, và mỗi loại giải quyết vấn đề gì.
