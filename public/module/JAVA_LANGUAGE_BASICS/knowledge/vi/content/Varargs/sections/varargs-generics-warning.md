> Phần này là ranh giới nâng cao với mô-đun Generics. Người mới có thể ghi nhớ rủi ro và quay lại sau khi đã học type erasure và reifiable type.

`varargs` được triển khai qua mảng, còn tham số kiểu generic chịu type erasure. Kết hợp hai cơ chế có thể tạo cảnh báo **heap pollution** với non-reifiable type:

```java
static <T> void addAll(List<T>... lists) { }
```

`@SafeVarargs` chỉ nên dùng khi cách triển khai thực sự không thực hiện thao tác không an toàn trên mảng `varargs`; annotation là một lời cam kết, không phải nút tắt cảnh báo tùy ý.

### Vì sao generic `varargs` nguy hiểm?

Mảng biết kiểu phần tử ở thời điểm chạy, còn tham số generic thường bị type erasure. Với `List<String>...`, thời điểm chạy không thể có một mảng thực sự biết đầy đủ tham số hóa `List<String>` theo cách kiểu trong mã nguồn thể hiện.

Ghi dữ liệu không an toàn qua một mảng alias có thể làm trình biên dịch tin một phần tử là `List<String>` trong khi cấu trúc ở thời điểm chạy chứa tham số hóa khác. Đó là một dạng **heap pollution**.

Quy tắc thực tế:

- ưu tiên API Collection khi số lượng phần tử biến đổi thực sự là một cấu trúc dữ liệu;
- dùng `varargs` khi sự tiện dụng tại vị trí gọi có giá trị rõ ràng;
- với generic `varargs`, không ghi dữ liệu không an toàn vào mảng và không đưa mảng ra cho mã có thể thay đổi sai kiểu;
- chỉ dùng `@SafeVarargs` khi bạn có thể giải thích vì sao cách triển khai thực sự an toàn.

Chương tiếp theo giải thích chính xác **thứ gì được sao chép khi đối số đi vào phương thức**.
