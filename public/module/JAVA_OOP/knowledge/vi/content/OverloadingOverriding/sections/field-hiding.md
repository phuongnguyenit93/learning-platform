Trường dữ liệu không có phân phối động.

```java
class Parent { String name = "parent"; }
class Child extends Parent { String name = "child"; }

Parent value = new Child();
System.out.println(value.name); // parent
```

`value.name` được quyết định từ kiểu khai báo của `value`, tức là `Parent`.

Đây là **che khuất trường**, không phải đa hình của trạng thái.

Hai trường cùng tên trong `Parent` và `Child` là **hai thành viên/vị trí lưu trữ khác nhau**, không phải một trường duy nhất được phân phối động. Ép kiểu hoặc kiểu khai báo khác nhau có thể làm cùng một đối tượng được quan sát qua các trường khác nhau, vì vậy che khuất trường rất dễ gây nhầm và thường nên tránh.

Việc dùng cùng một tên trường ở cả class cha và class con thường làm mã khó hiểu, nên tránh nếu không có lý do mạnh.
