Giả sử một phương thức tự chứa toàn bộ quy tắc lựa chọn bên trong luồng điều khiển:

```java
List<String> selectNames(List<String> names, String mode) {
    List<String> result = new ArrayList<>();

    for (String name : names) {
        if (mode.equals("LONG") && name.length() >= 5) {
            result.add(name);
        } else if (mode.equals("STARTS_WITH_A") && name.startsWith("A")) {
            result.add(name);
        }
    }

    return result;
}
```

Ở đây phần duyệt dữ liệu và quy tắc chọn dữ liệu bị trộn vào nhau. Mỗi quy tắc mới lại buộc ta sửa phương thức, thêm nhánh điều kiện và kiểm thử lại một luồng vốn không thay đổi.

Cơ chế lập trình hàm cho phép tách hai trách nhiệm:

- phương thức quyết định **khi nào và ở đâu** áp dụng quy tắc;
- bên gọi cung cấp **quy tắc nào** cần chạy.

Điều này không có nghĩa mọi câu `if` đều nên biến thành lambda. Tham số hóa hành vi có giá trị khi một thao tác thật sự có khả năng thay đổi hoặc cần tái sử dụng.
