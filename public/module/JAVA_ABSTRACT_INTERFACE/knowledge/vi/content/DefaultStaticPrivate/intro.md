# Phương thức default, static và private trong interface

Interface ban đầu chủ yếu được xem như nơi khai báo phương thức abstract. Java hiện đại cho phép interface chứa thêm một số loại phương thức có phần thân, nhưng **mỗi loại có vai trò khác nhau**.

```text
default
→ cung cấp hành vi mặc định của đối tượng có thể được kế thừa
→ hỗ trợ mở rộng hợp đồng tương thích khi có một mặc định hợp lý

static
→ thao tác thuộc chính kiểu interface
→ không trở thành phương thức của đối tượng được lớp triển khai kế thừa

private / private static
→ phương thức hỗ trợ nội bộ để các phương thức trong interface dùng lại phần triển khai
→ không mở rộng hợp đồng công khai
```
