```java
String a = "java";
String b = new String("java");
```

`a` trỏ tới literal trong pool, còn `new String(...)` yêu cầu tạo một đối tượng String mới.

Vì vậy:

```java
System.out.println(a == b);      // false
System.out.println(a.equals(b)); // true
```

Không dùng `new String("...")` nếu chỉ cần một literal bình thường; nó thường thêm đối tượng không cần thiết.

`new` không làm String trở nên có thể thay đổi:

```java
String x = new String("java");
x.toUpperCase();

System.out.println(x); // java
```

Hàm khởi tạo (constructor) chỉ thay đổi cách đối tượng được tạo, không thay đổi quy ước bất biến.
