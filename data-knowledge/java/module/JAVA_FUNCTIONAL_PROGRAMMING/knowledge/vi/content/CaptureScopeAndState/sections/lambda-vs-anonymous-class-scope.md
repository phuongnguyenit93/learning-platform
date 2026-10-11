Lớp vô danh tạo ra một phạm vi đối tượng mới. Bên trong phương thức thực thể của lớp vô danh, `this` trỏ tới chính đối tượng vô danh đó. Lambda thì không.

```java
class Demo {
    void showDifference() {
        Runnable anonymous = new Runnable() {
            @Override
            public void run() {
                System.out.println(this.getClass().getName());
            }
        };

        Runnable lambda = () ->
                System.out.println(this.getClass().getName());
    }
}
```

Trong lớp vô danh, `this` là đối tượng `Runnable` vô danh. Trong lambda, `this` là thực thể `Demo` bao quanh.

Vì thế, thay lớp vô danh bằng lambda không phải lúc nào cũng chỉ là rút gọn cú pháp. Nếu mã phụ thuộc vào danh tính của đối tượng vô danh, `this` riêng hoặc thành viên riêng của lớp đó, lambda không phải thay thế tương đương.
