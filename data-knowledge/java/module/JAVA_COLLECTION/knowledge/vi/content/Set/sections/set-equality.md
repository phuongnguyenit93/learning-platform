Hai `Set` bằng nhau khi chúng có cùng kích thước và mỗi phần tử của set này cũng nằm trong set kia. **thứ tự duyệt không tham gia `Set.equals`.**

```java
Set<Long> a = new HashSet<>(List.of(10L, 20L, 30L));
Set<Long> b = new LinkedHashSet<>(List.of(30L, 20L, 10L));

System.out.println(a.equals(b)); // true
```

Điều này khác `List.equals`, nơi vị trí của từng phần tử là một phần của tính bằng nhau. Vì vậy nếu giá trị nghiệp vụ chỉ quan tâm “có những thành viên nào” chứ không quan tâm thứ tự, `Set` thường biểu diễn ngữ nghĩa đúng hơn `List`.
