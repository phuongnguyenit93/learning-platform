Khi gọi phương thức, tham số nhận một bản sao của giá trị đối số.

```java
void increment(int x) {
    x++;
}
```

Bên gọi không thay đổi vì tham số `x` chỉ là một bản sao của giá trị nguyên thủy.

Với tham chiếu đối tượng:

```java
void use(User user) { }
```

tham số `user` cũng nhận một bản sao — nhưng bản sao này là tham chiếu tới cùng đối tượng.

### Mô hình tư duy: ô biến của bên gọi không được truyền vào phương thức

```text
biến bên gọi                       biến tham số
┌──────────────┐     sao chép      ┌──────────────┐
│ reference R  │ ───────────────→  │ reference R  │
└──────────────┘                   └──────────────┘
        │                                  │
        └──────────────→ đối tượng User ←─────┘
```

Phương thức nhận **một biến mới trong frame của lời gọi**. Nếu đối số là giá trị nguyên thủy, giá trị đó được sao chép. Nếu đối số là tham chiếu, giá trị tham chiếu được sao chép. Không trường hợp nào phương thức nhận trực tiếp ô biến của bên gọi.

Đây là lý do Java được mô tả nhất quán là pass-by-value, không cần ngoại lệ “primitive by value, object by reference”.
