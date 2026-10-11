Các phương thức hỗ trợ:

```java
Math.addExact
Math.subtractExact
Math.multiplyExact
Math.incrementExact
Math.decrementExact
Math.negateExact
Math.absExact
Math.divideExact
Math.floorDivExact
Math.ceilDivExact
Math.toIntExact
```

biến tràn số âm thầm thành `ArithmeticException`.

Ví dụ:

```java
long total =
        Math.multiplyExact(
                (long) quantity,
                unitPrice
        );
```

### Phương thức kiểm tra tràn không tạo ra phạm vi tùy ý

Nếu giá trị hợp lệ có thể vượt `long`, các phương thức `*Exact` chỉ giúp **phát hiện** tràn số. Cách biểu diễn đúng vẫn là `BigInteger`.

Với Java 21, `Math.absExact(Integer.MIN_VALUE)` và `Math.divideExact(Integer.MIN_VALUE, -1)` ném `ArithmeticException` thay vì trả kết quả tràn số âm thầm như các phép tương ứng không có kiểm tra.
