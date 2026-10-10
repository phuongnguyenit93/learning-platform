# Wildcard, PECS và chiều đọc/ghi dữ liệu

Chương trước đã giải thích vì sao `List<Dog>` không tự trở thành `List<Animal>`. Quy tắc đó giữ an toàn kiểu, nhưng API thực tế vẫn cần một cách chấp nhận **một họ kiểu generic liên quan** mà không phá quy tắc bất biến.

Đến đây ta cũng biết `List<String>` và `List<Integer>` là hai kiểu được tham số hóa (parameterized type) khác nhau. Bây giờ xuất hiện một nhu cầu mới:

```text
"Phương thức này không quan tâm List chứa chính xác kiểu gì.
Nó chỉ cần thực hiện một thao tác áp dụng được cho mọi List."
```

Ví dụ phương thức chỉ cần lấy kích thước:

```java
static int sizeOf(List<?> values) {
    return values.size();
}
```

Ta không cần đặt tên kiểu phần tử là `T`, vì phương thức không cần liên kết kiểu đó với tham số hay giá trị trả về nào khác.

**Wildcard `?`** có thể hiểu là: “ở đây có một type argument cụ thể, nhưng đoạn mã này không cần biết chính xác nó là kiểu nào”.

Wildcard tồn tại để làm **ranh giới API linh hoạt hơn** mà vẫn giữ an toàn kiểu của Generics. Các dạng `? extends ...` và `? super ...` tiếp tục nói rõ kiểu chưa biết đó nằm ở phía nào trong hệ phân cấp kiểu.

Kết nối trực tiếp với chương Invariance:

```java
List<Dog> dogs = new ArrayList<>();

List<? extends Animal> animals = dogs;
List<? super Dog> target = new ArrayList<Animal>();
```

Wildcard cung cấp **biến thiên tại nơi sử dụng (use-site variance)** có kiểm soát thay vì biến kiểu generic thành hiệp biến toàn cục.

Chương Invariance trước đó đã giới thiệu mô hình `List<E>` tối thiểu (`get` để đọc, `add` để ghi, `size` để lấy số phần tử). Chương này dùng lại đúng mô hình đó, không yêu cầu thêm kiến thức Collection.
