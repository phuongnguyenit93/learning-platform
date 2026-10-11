Đây là nhầm lẫn rất phổ biến:

```java
List<?> unknown;
List<Object> objects;
```

`List<Object>` có nghĩa **kiểu phần tử chính xác là `Object`**. Vì vậy có thể thêm `String`, `Integer`, `User`... vì tất cả đều là subtype của `Object`:

```java
objects.add("java");
objects.add(123);
```

`List<?>` lại có nghĩa **kiểu phần tử chính xác tồn tại nhưng ta không biết nó là gì**. Biến này có thể tham chiếu `List<String>`, `List<Integer>`, `List<User>`...

```java
List<String> names = new ArrayList<>();
List<?> unknown = names; // OK
```

Do compiler không biết kiểu thật bị ẩn phía sau wildcard là gì, ta không thể thêm một giá trị cụ thể tùy ý:

```java
// unknown.add("java"); // compile error
```

Mô hình tư duy:

```text
List<Object>
→ biết chính xác element type = Object

List<?>
→ biết đây là List của MỘT type nào đó
→ nhưng không biết type đó là gì
```
