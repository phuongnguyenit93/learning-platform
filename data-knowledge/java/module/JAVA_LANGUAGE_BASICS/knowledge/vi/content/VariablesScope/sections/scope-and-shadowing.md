Phạm vi quyết định tên nào có thể được dùng tại một vị trí mã nguồn.

Một tên ở phạm vi bên trong có thể che một tên khác ở phạm vi ngoài trong những trường hợp Java cho phép. Ví dụ tham số có thể che trường:

```java
void setName(String name) {
    this.name = name;
}
```

`this.name` là trường; `name` là tham số.

Che khuất tên hợp lệ không có nghĩa luôn dễ đọc. Nếu nhiều phạm vi lồng nhau dùng cùng tên với ý nghĩa khác, mã dễ gây nhầm.

### Phạm vi khối

Một biến cục bộ chỉ nhìn thấy trong khối mà nó được khai báo và các khối lồng hợp lệ sau điểm khai báo:

```java
if (condition) {
    int result = 10;
    System.out.println(result);
}
// result không còn trong phạm vi ở đây
```

Biểu thức khởi tạo của vòng lặp cũng có phạm vi riêng:

```java
for (int i = 0; i < 3; i++) {
    System.out.println(i);
}
// i không tồn tại ở đây
```

### Che khuất tên và khả năng đọc

```java
class User {
    private String name;

    void setName(String name) {
        this.name = name;
    }
}
```

Trường hợp tham số che trường là phổ biến và `this` làm ý định rõ. Nhưng việc tái dùng cùng tên cho nhiều biến cục bộ ở phạm vi lồng nhau thường buộc người đọc liên tục xác định “tên nào” đang được dùng.
