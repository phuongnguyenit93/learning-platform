Một type parameter có thể cần thỏa nhiều hợp đồng kiểu:

```java
static <T extends Number & Comparable<T>> T larger(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
```

Nếu có giới hạn bằng lớp (`class`), lớp phải đứng đầu và chỉ có thể có tối đa một lớp:

```java
<T extends SomeClass & InterfaceA & InterfaceB>
```

Không hợp lệ:

```java
// <T extends InterfaceA & SomeClass> ...
```

Thứ tự bound còn có ảnh hưởng ở lúc biên dịch/runtime. Chương **Type Erasure** sẽ giải thích chính xác vì sao bound đứng đầu có vai trò đặc biệt; ở đây chỉ cần nhớ quy tắc cú pháp: nếu có class bound thì nó đứng trước các interface bound.
