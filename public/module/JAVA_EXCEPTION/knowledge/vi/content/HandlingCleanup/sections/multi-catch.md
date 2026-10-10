Nếu nhiều exception cần **cùng một chính sách xử lý**, Java cho phép:

```java
try {
    importData();
} catch (IOException | SQLException ex) {
    auditAndAbort(ex);
}
```

### VÌ SAO?

Không có multi-catch, ta dễ lặp:

```java
catch (IOException ex) {
    auditAndAbort(ex);
} catch (SQLException ex) {
    auditAndAbort(ex);
}
```

### Các kiểu trong multi-catch không được có quan hệ subtype với nhau

Không hợp lệ:

```java
catch (FileNotFoundException | IOException ex) {
    ...
}
```

vì `FileNotFoundException` đã là subtype của `IOException`. Quy tắc này áp dụng cho **bất kỳ quan hệ cha-con nào** giữa các alternative, không chỉ trường hợp kế thừa trực tiếp.

### Đừng gom chỉ để giảm số dòng

Nếu hai lỗi có chính sách xử lý khác:

```text
FileNotFoundException
→ yêu cầu người dùng chọn file khác

SQLException
→ báo hệ thống lưu trữ không khả dụng
```

thì việc nhét cả hai vào một multi-catch chỉ vì phần xử lý hiện tại giống nhau có thể làm mất ý nghĩa.

Sau khi hiểu cách một hoặc nhiều loại exception được bắt, phần tiếp theo đi vào `finally`: công việc nào vẫn phải diễn ra khi luồng điều khiển rời `try/catch`?
