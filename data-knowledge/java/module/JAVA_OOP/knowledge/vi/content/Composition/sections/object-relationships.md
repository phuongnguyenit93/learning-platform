Các thuật ngữ này mô tả **mức độ quan hệ giữa các đối tượng trong thiết kế**. Chúng không phải bốn tính năng lúc chạy riêng biệt của Java.

| Quan hệ | Ý nghĩa thường gặp | Cách biểu diễn thường thấy trong Java |
| --- | --- | --- |
| Dependency | Dùng tạm một đối tượng để hoàn thành thao tác | Tham số / biến cục bộ |
| Association | Hai đối tượng có quan hệ lâu dài hơn | Trường / tham chiếu |
| Aggregation | Sở hữu yếu hoặc có thể chia sẻ | Trường / tham chiếu + quy ước vòng đời |
| Composition | Sở hữu mạnh, vòng đời của thành phần gắn với toàn thể | Trường / tham chiếu + quy tắc tạo/sở hữu |

Java chủ yếu chỉ nhìn thấy **tham chiếu**. Ý nghĩa “sở hữu yếu” hay “sở hữu mạnh” đến từ cách ta thiết kế API và quản lý vòng đời đối tượng.

### CẠM BẪY — tham chiếu `final` không tự tạo quan hệ hợp thành

Ví dụ:

```java
class Team {
    private final Player captain;

    Team(Player captain) {
        this.captain = captain;
    }
}
```

`final` chỉ đảm bảo trường `captain` không bị gán sang tham chiếu khác sau khi khởi tạo. Nó **không chứng minh** rằng:

- `Team` là bên sở hữu duy nhất của `Player`;
- `Player` không được chia sẻ cho đối tượng khác;
- `Player` phải chết theo vòng đời của `Team`;
- quan hệ này chắc chắn là composition theo nghĩa mô hình hóa.

Quyền sở hữu là **ngữ nghĩa của thiết kế**, không phải thuộc tính mà Java suy ra từ một từ khóa đơn lẻ.

### VÌ SAO — không thể nhìn cú pháp rồi kết luận ngay quan hệ

Hai class cùng có trường tham chiếu tới đối tượng khác chưa đủ để kết luận đó là aggregation hay composition.

Ta cần xem:

- ai tạo đối tượng con;
- đối tượng con có thể tồn tại độc lập không;
- đối tượng con có thể được chia sẻ cho nhiều bên sở hữu không;
- ai kiểm soát vòng đời của nó.
