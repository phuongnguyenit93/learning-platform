Tính bằng nhau của phần tử là nền tảng, nhưng từng mô hình trừu tượng dùng nó để định nghĩa **tính bằng nhau của cả cấu trúc chứa** theo ngữ nghĩa riêng:

| Mô hình trừu tượng | Hai cấu trúc bằng nhau khi... |
| --- | --- |
| `List` | cùng kích thước và phần tử bằng nhau ở từng vị trí tương ứng |
| `Set` | cùng kích thước và có cùng các phần tử; thứ tự duyệt không quan trọng |
| `Map` | có cùng các ánh xạ `khóa → giá trị`; thứ tự duyệt không quan trọng |

```java
List<Integer> listA = List.of(1, 2);
List<Integer> listB = List.of(2, 1);
System.out.println(listA.equals(listB)); // false

Set<Integer> setA = new HashSet<>(List.of(1, 2));
Set<Integer> setB = new LinkedHashSet<>(List.of(2, 1));
System.out.println(setA.equals(setB));   // true
```

Điều này giải thích vì sao chọn `List` hay `Set` không chỉ là quyết định hiệu năng. Mô hình trừu tượng còn quyết định **giá trị logic của cấu trúc là gì**. Chi tiết đầy đủ về luật `equals/hashCode` của đối tượng vẫn thuộc module **Quy ước của Object**.
