```java
enum AccountStatus {
    ACTIVE, FROZEN, CLOSED
}
```

`AccountStatus.ACTIVE` là một đối tượng duy nhất đại diện cho hằng đó theo hợp đồng của `enum`, không phải bí danh của một số nguyên.

Vì mỗi hằng có danh tính ổn định, so sánh enum bằng `==` là phù hợp và thường được khuyến nghị.
