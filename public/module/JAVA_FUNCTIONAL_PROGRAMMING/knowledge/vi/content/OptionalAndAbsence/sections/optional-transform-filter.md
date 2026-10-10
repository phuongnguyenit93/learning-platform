`map` biến đổi giá trị khi nó tồn tại. Nếu `Optional` rỗng, hàm ánh xạ không được gọi và kết quả tiếp tục là `Optional.empty()`.

```java
Optional<String> normalizedName = user
        .map(User::name)
        .map(String::trim);
```

Nếu hàm biến đổi vốn đã trả về `Optional`, dùng `flatMap` để tránh tạo `Optional<Optional<T>>`.

```java
Optional<Address> address = user.flatMap(User::address);
```

`filter` giữ lại giá trị hiện có khi điều kiện trả về `true`; nếu không, kết quả trở thành `Optional.empty()`.

```java
Optional<User> active = user.filter(User::isActive);
```

Điểm hữu ích là trường hợp vắng mặt tự động bỏ qua phép biến đổi hoặc điều kiện mà không cần kiểm tra `null` ở từng bước.
