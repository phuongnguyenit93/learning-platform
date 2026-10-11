IEEE 754 có các giá trị đặc biệt:

```text
NaN
→ kết quả không phải giá trị số thông thường

Infinity / -Infinity
→ tràn số hoặc một số trường hợp chia cho 0

+0.0 / -0.0
→ hai cách biểu diễn số 0 có dấu khác nhau
```

Ví dụ:

```java
double nan = 0.0 / 0.0;
double inf = 1.0 / 0.0;
double negInf = -1.0 / 0.0;

System.out.println(Double.isNaN(nan));      // true
System.out.println(Double.isInfinite(inf)); // true
```

### Sự lan truyền của NaN

```java
double result = Double.NaN + 10;
System.out.println(result); // NaN
```

`NaN == NaN` là `false`. Vì vậy khi cần kiểm tra NaN, dùng:

```java
Double.isNaN(value)
```

### Số 0 có dấu

```java
System.out.println(0.0 == -0.0); // true
```

nhưng dấu vẫn có thể ảnh hưởng đến phép toán:

```java
System.out.println(1.0 / 0.0);  // Infinity
System.out.println(1.0 / -0.0); // -Infinity
```
