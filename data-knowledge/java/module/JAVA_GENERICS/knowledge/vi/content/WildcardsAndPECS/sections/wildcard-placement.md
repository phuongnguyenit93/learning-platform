Wildcard là **type argument ở nơi sử dụng (use site)**, không phải cách khai báo một type parameter mới.

Các dạng sau là hợp lệ:

```java
List<?> values;
List<? extends Number> numbers;
List<? super Integer> targets;
```

Nhưng không thể khai báo generic class bằng wildcard:

```java
// class Box<?> { } // compile error
```

Và không thể dùng wildcard trực tiếp làm type argument của object đang được tạo:

```java
// new ArrayList<?>(); // compile error
```

Tương tự, wildcard không được dùng làm type argument trực tiếp trong `extends` / `implements` của một khai báo:

```java
// class MyList extends ArrayList<?> { } // compile error
```

Mental model:

```text
<T>
→ khai báo một type variable có tên

?
→ mô tả một type argument chưa biết ở use site
```
