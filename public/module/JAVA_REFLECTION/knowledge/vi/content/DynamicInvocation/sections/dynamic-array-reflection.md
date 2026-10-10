Mảng là một trường hợp khác của **thao tác được điều khiển bởi siêu dữ liệu**. Cú pháp Java thông thường cần kiểu phần tử xuất hiện trực tiếp trong mã nguồn:

```java
String[] values = new String[3];
```

Nhưng framework có thể chỉ nhận `Class<?> componentType` từ cấu hình, schema hoặc một ánh xạ đã được xác định lúc chạy. Khi đó `java.lang.reflect.Array` cho phép tạo mảng mà không cần ghi cứng kiểu phần tử:

```java
Class<?> componentType = String.class;
Object array = Array.newInstance(componentType, 3);

Array.set(array, 0, "A");
Array.set(array, 1, "B");

Object first = Array.get(array, 0);
System.out.println(first); // A
```

Kiểu lúc chạy của `array` vẫn là `String[]`, dù biến ở thời điểm biên dịch trong ví dụ là `Object`:

```java
System.out.println(array.getClass());                   // class [Ljava.lang.String;
System.out.println(array.getClass().isArray());         // true
System.out.println(array.getClass().getComponentType());// class java.lang.String
```

`Array` cũng hỗ trợ mảng primitive. Các hàm như `getInt(...)`, `setInt(...)`, `getLong(...)` giúp thao tác mà không cần ép mảng về đúng kiểu mảng primitive trước:

```java
Object numbers = Array.newInstance(int.class, 2);

Array.setInt(numbers, 0, 10);
Array.setInt(numbers, 1, 20);

System.out.println(Array.getInt(numbers, 1)); // 20
```

Mảng nhiều chiều có thể được tạo bằng overload nhận nhiều kích thước:

```java
Object matrix = Array.newInstance(String.class, 2, 3);
System.out.println(matrix.getClass()); // class [[Ljava.lang.String;
```

Reflection không làm mất quy tắc kiểu của mảng. Sai chỉ số vẫn gây lỗi; giá trị không tương thích với kiểu phần tử vẫn bị từ chối lúc chạy; kích thước âm vẫn không hợp lệ. `Array` chỉ chuyển quyết định **kiểu phần tử + số chiều + truy cập** từ cú pháp tại thời điểm biên dịch sang siêu dữ liệu lúc chạy.

~~~text
kiểu phần tử biết tại thời điểm biên dịch
→ new T[length]

kiểu phần tử chỉ biết lúc chạy
→ Array.newInstance(componentType, length)
→ Array.get / Array.set
~~~
