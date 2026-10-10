Hợp đồng `List.equals` không chỉ kiểm tra “cùng phần tử”. Hai list bằng nhau khi:

1. đối tượng kia cũng là `List`;
2. hai list có cùng số phần tử;
3. từng cặp phần tử ở **cùng vị trí** bằng nhau theo `equals`.

```java
List<Long> a = List.of(10L, 20L, 30L);
List<Long> b = List.of(10L, 20L, 30L);
List<Long> c = List.of(30L, 20L, 10L);

System.out.println(a.equals(b)); // true
System.out.println(a.equals(c)); // false
```

Do đó thứ tự duyệt là một phần của giá trị logic của `List`. Nếu ngữ nghĩa nghiệp vụ nói rằng thứ tự không quan trọng và chỉ cần tính duy nhất, `Set` có thể là mô hình trừu tượng đúng hơn.

Quy tắc đầy đủ của `equals/hashCode` thuộc module **Quy ước của Object**. Trong Collection, điều cần giữ là: quy tắc tính bằng nhau của phần tử ảnh hưởng tới nhiều thao tác như `contains`, `indexOf` và tính bằng nhau của cả List; còn thứ tự làm cho `List` khác `Set` về ý nghĩa.
