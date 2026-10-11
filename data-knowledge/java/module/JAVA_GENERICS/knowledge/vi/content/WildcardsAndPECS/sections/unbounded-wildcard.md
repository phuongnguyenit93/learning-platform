```java
static int sizeOf(List<?> values) {
    return values.size();
}
```

`List<?>` nghĩa là “một `List` của kiểu nào đó, nhưng phương thức này không biết kiểu đó là gì”.

Nó khác raw `List`:

- `List<?>` vẫn giữ các kiểm tra an toàn kiểu của Generics;
- raw `List` làm mất một phần kiểm tra generic và có thể sinh cảnh báo unchecked.

Từ `List<?>`, có thể đọc phần tử an toàn dưới dạng `Object`:

```java
Object value = values.get(0);
```

Không thể thêm một object cụ thể vì compiler không biết kiểu phần tử thật:

```java
// values.add("x"); // compile error
```

`null` là ngoại lệ về mặt hệ thống kiểu, nhưng việc thêm `null` hiếm khi là lý do thiết kế một API wildcard.
