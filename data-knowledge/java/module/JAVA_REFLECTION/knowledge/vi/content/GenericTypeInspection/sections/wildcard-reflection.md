Wildcard biểu diễn quan hệ variance tại thời điểm biên dịch và siêu dữ liệu giữ lại các giới hạn của nó.

Với field:

```java
List<? extends T> values;
```

đối số kiểu là `WildcardType` có giới hạn trên `T` và không có giới hạn dưới hữu ích. Với:

```java
List<? super Integer> sinks;
```

wildcard có giới hạn dưới `Integer`; giới hạn trên của nó vẫn là `Object`.

Ta có thể quan sát như sau:

```java
ParameterizedType listType = (ParameterizedType)
        Repository.class.getDeclaredField("sinks").getGenericType();

WildcardType wildcard = (WildcardType) listType.getActualTypeArguments()[0];

System.out.println(Arrays.toString(wildcard.getUpperBounds()));
System.out.println(Arrays.toString(wildcard.getLowerBounds()));
```

Điều Reflection cung cấp là siêu dữ liệu về **ràng buộc đã khai báo**. Nó không biến wildcard thành một class cụ thể ở lúc chạy. Nếu framework cần phân giải cây kiểu, nó phải hiểu ý nghĩa của giới hạn trên/dưới và tiếp tục phân giải `Type` lồng nhau khi cần.
