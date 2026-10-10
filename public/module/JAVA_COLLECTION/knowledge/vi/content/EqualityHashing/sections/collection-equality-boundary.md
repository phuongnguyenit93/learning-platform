`Collection<E>` tự nó **không định nghĩa một quy tắc bằng nhau theo giá trị chung cho mọi cách triển khai collection**. Các kiểu con cụ thể mới có thể đặt quy tắc tính bằng nhau riêng.

- `List` định nghĩa tính bằng nhau theo **cùng kích thước + phần tử bằng nhau ở từng vị trí**.
- `Set` định nghĩa tính bằng nhau theo **cùng các phần tử**, không quan tâm thứ tự duyệt.
- `Map` định nghĩa tính bằng nhau theo **cùng các ánh xạ**.
- `Queue` nói chung không áp đặt một quy tắc bằng nhau theo phần tử chung; nhiều cách triển khai Queue/Deque như `ArrayDeque` và `PriorityQueue` giữ `equals/hashCode` dựa trên định danh từ `Object`.

```java
Queue<Integer> a = new ArrayDeque<>(List.of(1, 2, 3));
Queue<Integer> b = new ArrayDeque<>(List.of(1, 2, 3));

System.out.println(a.equals(b)); // false: hai đối tượng khác nhau
```

`LinkedList` là trường hợp cần đọc theo **quy ước của kiểu mà nó đồng thời thực hiện**: nó là `List`, nên tính bằng nhau của nó tuân theo quy tắc bằng nhau theo giá trị của `List` dù nó cũng dùng được như `Deque`.

Vì vậy không nên suy diễn “cùng phần tử thì mọi Collection đều equals nhau”. Tính bằng nhau của cấu trúc chứa là một phần của quy ước kiểu con/cách triển khai, không phải tính chất chung của `Collection`.
