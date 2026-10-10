Ở mức tư duy cơ bản, một **collection** là một đối tượng dùng để quản lý **một nhóm phần tử** thay vì bắt mã nguồn phải quản lý từng biến riêng lẻ.

Ví dụ:

```java
List<Order> orders = new ArrayList<>();

orders.add(new Order(1001, 7, 120));
orders.add(new Order(1002, 8, 90));
orders.add(new Order(1003, 7, 150));

System.out.println(orders.size());

for (Order order : orders) {
    System.out.println(order.id());
}
```

Thay vì phải tạo `order1`, `order2`, `order3`, ... và viết logic riêng cho từng biến, mã nguồn làm việc với **một đối tượng đại diện cho cả nhóm**.

Đọc khai báo này từ trái sang phải:

```java
List<Order> orders = new ArrayList<>();
```

- `List<Order>` nói biến tuân theo quy ước của `List` và kiểu phần tử là `Order`;
- `new ArrayList<>()` chọn `ArrayList` làm lớp triển khai cụ thể;
- toán tử diamond `<>` cho trình biên dịch suy ra `Order` từ kiểu bên trái, nên không cần lặp lại `new ArrayList<Order>()`.

Collection dùng generic lưu **kiểu tham chiếu (reference type)**. Khi cần lưu kiểu nguyên thủy (primitive), Java dùng kiểu bao (wrapper type) tương ứng, ví dụ `List<Integer>` cho `int`, `List<Long>` cho `long`. Chi tiết boxing/unboxing thuộc module Cơ bản ngôn ngữ và Generics; ở đây chỉ cần nhận ra vì sao không viết `List<int>`.

### Vấn đề trước khi có collection

Mảng đã cho Java một cách lưu nhiều phần tử cùng kiểu:

```java
Order[] orders = new Order[100];
```

Mảng vẫn rất hữu ích khi kích thước cố định hoặc khi API/hiệu năng yêu cầu nó. Nhưng nếu dùng mảng cho dữ liệu động, ứng dụng thường phải tự xử lý nhiều việc:

```text
Mảng đã đầy thì làm gì?
→ tự tạo mảng lớn hơn và sao chép dữ liệu

Muốn xóa phần tử ở giữa?
→ tự dịch các phần tử còn lại

Muốn không cho trùng?
→ tự viết logic kiểm tra

Muốn tra cứu theo id?
→ tự duyệt hoặc tự xây cấu trúc chỉ mục

Muốn xử lý FIFO/LIFO?
→ tự quản lý vị trí đầu/cuối
```

Collections Framework cung cấp những cấu trúc đã chuẩn hóa để ứng dụng không phải tự phát minh lại các cơ chế phổ biến đó.

### Java Collections Framework là gì?

**Java Collections Framework (JCF)** là tập hợp các interface, lớp triển khai và thuật toán/tiện ích chuẩn của Java để biểu diễn và thao tác với nhóm dữ liệu.

Mô hình tư duy:

```text
Dữ liệu có nhiều phần tử
        ↓
Cần một đối tượng quản lý cả nhóm
        ↓
Collections Framework cung cấp các quy ước khác nhau
        ↓
List / Set / Queue / Deque / Map
        ↓
chọn quy ước theo hành vi bài toán cần
```

Ví dụ, cùng một tập `Order` nhưng nhu cầu khác nhau dẫn tới cấu trúc khác nhau:

```java
List<Order> ordersInArrivalOrder = new ArrayList<>();
Set<Long> uniqueUserIds = new HashSet<>();
Map<Long, Order> orderById = new HashMap<>();
Deque<Order> pendingOrders = new ArrayDeque<>();
```

Đây là lý do Collection không phải chỉ là “một cái List để chứa nhiều đối tượng”. Nó là **một họ mô hình trừu tượng cho nhiều kiểu bài toán quản lý nhóm dữ liệu**.
