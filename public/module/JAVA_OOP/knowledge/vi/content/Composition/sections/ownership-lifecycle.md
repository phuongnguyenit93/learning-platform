### Kết tập (Aggregation) — sở hữu yếu hơn

Part có thể tồn tại độc lập hoặc được chia sẻ.

Ví dụ:

```text
Team
→ tham chiếu Player

nhưng Player vẫn có thể tồn tại ngay cả khi Team không còn
```

### Hợp thành (Composition) — sở hữu mạnh hơn

Whole thường chịu trách nhiệm tạo và quản lý part.

Ví dụ:

```text
Order
→ sở hữu các OrderLine

OrderLine thường chỉ có ý nghĩa khi thuộc một Order cụ thể
```

### CƠ CHẾ — Java không tự áp đặt quyền sở hữu

Garbage Collector chỉ quan tâm đối tượng còn được tham chiếu hay không. Nó không biết khái niệm UML như aggregation hay composition.

Vì vậy quan hệ sở hữu phải được thể hiện bằng:

- hàm khởi tạo hoặc factory;
- mức độ có thể thay đổi;
- cách công khai tham chiếu;
- có cho phép chia sẻ đối tượng hay không;
- quy tắc tạo và giữ đối tượng.
