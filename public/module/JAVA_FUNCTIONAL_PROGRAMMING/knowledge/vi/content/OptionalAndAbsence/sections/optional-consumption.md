Khi chỉ cần thực hiện một hành động nếu có giá trị, `ifPresent` diễn đạt đúng ý định đó.

```java
user.ifPresent(found -> audit.log("Found " + found.id()));
```

Nếu cả hai trường hợp đều cần hành động, `ifPresentOrElse` giữ hai nhánh cạnh nhau.

```java
user.ifPresentOrElse(
        this::displayUser,
        () -> displayMessage("User not found")
);
```

Các phương thức này phù hợp cho hành động kết thúc. Nếu vẫn cần một giá trị cho bước tính toán tiếp theo, nên dùng phép biến đổi hoặc phương án thay thế thay vì tạo biến tạm có thể thay đổi bên trong `ifPresent`.

`ifPresentOrElse` được bổ sung sau API `Optional` ban đầu của Java 8, cụ thể từ Java 9. Mô-đun Java Core này trình bày API ổn định hiện tại; mô-đun Java 8 giữ vai trò giải thích bối cảnh theo phiên bản khi tính năng được giới thiệu.
