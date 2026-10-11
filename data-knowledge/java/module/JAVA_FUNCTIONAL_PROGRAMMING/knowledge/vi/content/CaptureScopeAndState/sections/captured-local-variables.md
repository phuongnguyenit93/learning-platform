Khi lambda dùng một biến cục bộ được khai báo bên ngoài thân lambda, biến đó được gọi là **biến cục bộ bị bắt giữ (captured local variable)**.

```java
Predicate<String> minimumLength(int min) {
    return text -> text.length() >= min;
}
```

Tham số `min` thuộc lần gọi `minimumLength`, nhưng lambda được trả về có thể được dùng sau khi phương thức này đã kết thúc. Vì vậy Java phải để lambda giữ lại giá trị cần thiết mà không phụ thuộc vào khung ngăn xếp ban đầu.

Biến được khai báo ngay bên trong lambda là biến cục bộ của chính lần thực thi lambda, không phải biến bị bắt giữ:

```java
Function<String, Integer> length = text -> {
    String trimmed = text.trim();
    return trimmed.length();
};
```

Ở đây `trimmed` chỉ tồn tại trong lần gọi lambda.
