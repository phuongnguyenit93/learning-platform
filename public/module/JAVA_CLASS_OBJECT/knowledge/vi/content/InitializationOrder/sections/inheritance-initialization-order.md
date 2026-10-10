Với `new Child()`:

```text
khởi tạo lớp nếu cần
        ↓
khởi tạo phần đối tượng Parent
        ↓
thân hàm khởi tạo Parent
        ↓
khởi tạo phần đối tượng Child
        ↓
thân hàm khởi tạo Child
```

Hiểu thứ tự này giải thích vì sao gọi phương thức có thể bị ghi đè quá sớm trong hàm khởi tạo nguy hiểm: phương thức của lớp con có thể chạy trước khi các trường của lớp con được khởi tạo như mong đợi.

Có thể quan sát thứ tự đó bằng một đoạn ghi vết nhỏ:

```java
class Trace {
    static int log(String step) {
        System.out.println(step);
        return 0;
    }
}

class Parent {
    int parentField = Trace.log("parent field");
    { Trace.log("parent block"); }
    Parent() { Trace.log("parent constructor"); }
}

class Child extends Parent {
    int childField = Trace.log("child field");
    { Trace.log("child block"); }
    Child() { Trace.log("child constructor"); }
}
```

Nếu lớp đã được khởi tạo trước đó, `new Child()` sẽ in các bước trường/khối/hàm khởi tạo của `Parent` trước rồi mới tới các bước tương ứng của `Child`. Đoạn mã này là minh chứng cho thứ tự ở trên, không thay thế cho việc hiểu quy tắc.

Chương tiếp theo nhìn toàn bộ quá trình tạo đối tượng và rủi ro khi `this` bị chia sẻ ra ngoài quá sớm.
