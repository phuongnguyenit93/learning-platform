“Kiểu generic là invariant” **không có nghĩa class/interface generic mất quan hệ kế thừa đã khai báo**.

Nếu chính khai báo generic có quan hệ kế thừa:

```java
interface Container<T> {}

class ArrayContainer<T> implements Container<T> {}
```

thì với **cùng type argument**, quan hệ kiểu con vẫn được giữ:

```java
ArrayContainer<String> child = new ArrayContainer<>();
Container<String> parent = child; // OK
```

Điều tính bất biến ngăn là tự tạo quan hệ kiểu con chỉ vì **type argument** có quan hệ:

```java
Dog <: Animal

nhưng

Container<Dog> </: Container<Animal>
```

Hai câu phải được giữ cùng lúc:

```text
quan hệ kế thừa của khai báo vẫn hoạt động
+
quan hệ kiểu con của type argument không tự được truyền qua kiểu generic
```

### MÔ HÌNH TƯ DUY TỐI THIỂU VỀ `List<E>` DÙNG TỪ ĐÂY TRỞ ĐI

Module Collection nằm ngay sau Generics, nên ở đây **không học cách triển khai hay hiệu năng của `List`**. Chỉ cần coi:

```text
List<E>
→ một cấu trúc chứa nhiều giá trị kiểu E

get(...)
→ đọc một E ra

add(E)
→ ghi một E vào

size()
→ lấy số phần tử
```

Từ đây, các ví dụ Invariance/Wildcard/PECS chỉ dùng đúng mô hình đọc/ghi tối thiểu này.
