Phương thức cũng có thể tạo một hành vi rồi trả nó về để dùng sau. Cách này hữu ích khi xây dựng các quy tắc kiểm tra, phép biến đổi, hàm gọi lại hoặc chính sách có thể tái sử dụng.

```java
static Predicate<String> hasMinLength(int min) {
    return text -> text != null && text.length() >= min;
}

Predicate<String> atLeastFive = hasMinLength(5);
boolean valid = atLeastFive.test("Java 21");
```

Tại thời điểm chạy, giá trị trả về là một thực thể của kiểu giao diện hàm đích. Bên gọi nên phụ thuộc vào hợp đồng giao diện thay vì lớp hiện thực hoặc danh tính đối tượng, và không cần biết hành vi đến từ lambda, tham chiếu phương thức hay một lớp có tên.
