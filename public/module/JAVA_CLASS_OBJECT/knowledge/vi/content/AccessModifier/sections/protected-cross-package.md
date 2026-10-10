`protected` thường bị hiểu đơn giản là “lớp con truy cập được”. Ngoài package, quy tắc còn phụ thuộc vào **ngữ cảnh lớp con và kiểu tham chiếu dùng để truy cập**.

Một lớp con ở package khác không có quyền tùy ý dùng thành viên `protected` thông qua mọi đối tượng của lớp cha.

Ví dụ, giả sử `Parent` nằm trong package `a` và có một field `protected`:

```java
package a;

public class Parent {
    protected int value;
}
```

Một lớp con trong package `b` có thể truy cập thành viên kế thừa qua đúng ngữ cảnh lớp con, nhưng không thể truy cập tùy ý qua một tham chiếu kiểu `Parent`:

```java
package b;

import a.Parent;

class Child extends Parent {
    void allowed(Child other) {
        this.value = 1;
        other.value = 2;
    }

    void rejected(Parent other) {
        // other.value = 3; // lỗi biên dịch
    }
}
```

Vì vậy không nên ghi nhớ `protected` bằng câu rút gọn “lớp con luôn truy cập được”. Hãy xem nó là một quy tắc truy cập cụ thể của ngôn ngữ.
