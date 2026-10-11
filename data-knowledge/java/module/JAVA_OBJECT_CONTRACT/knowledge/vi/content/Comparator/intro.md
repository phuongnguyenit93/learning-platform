# Thứ tự tùy biến với Comparator

`Comparable` đặt một thứ tự tự nhiên bên trong kiểu dữ liệu. `Comparator<T>` tách chính sách sắp xếp ra **bên ngoài kiểu dữ liệu**, nhờ đó cùng một dữ liệu có thể được nhìn theo nhiều thứ tự khác nhau mà không sửa lớp nghiệp vụ.

Đây là khác biệt thiết kế quan trọng:

```text
Comparable
→ kiểu dữ liệu sở hữu một thứ tự tự nhiên

Comparator
→ đoạn mã sử dụng/ngữ cảnh sở hữu một chính sách sắp xếp
```
