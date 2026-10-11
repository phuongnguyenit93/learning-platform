Mã Java được viết trong các tệp nguồn `.java`. Một tệp có thể chứa khai báo `package`, các `import` và một hoặc nhiều khai báo kiểu theo các quy tắc của ngôn ngữ.

Ví dụ tối giản:

```java
package demo;

import java.util.List;

public class App {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

Ở mức nền tảng, hãy đọc cấu trúc từ ngoài vào trong:

```text
tệp mã nguồn
→ package/import
→ khai báo kiểu
→ thành viên
→ thân phương thức/constructor
→ câu lệnh/biểu thức
```

`package` và `import` mới chỉ được nhận diện ở đây để đọc được tệp nguồn. Cơ chế không gian tên, phân giải tên và quyền truy cập trong cùng `package` được học ở chặng riêng phía sau.
