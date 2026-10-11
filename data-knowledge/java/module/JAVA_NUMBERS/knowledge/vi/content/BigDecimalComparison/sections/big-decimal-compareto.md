`compareTo` trả lời câu hỏi về thứ tự/giá trị số:

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("1.00");

System.out.println(a.compareTo(b)); // 0
```

Cách ghi nhớ:

```text
equals
→ cách biểu diễn giá trị + scale

compareTo
→ thứ tự theo giá trị số
```

Đây là một ngoại lệ nổi tiếng đối với khuyến nghị chung rằng `compareTo == 0` nên nhất quán với `equals`.

### So sánh với số 0

Nếu mục đích là kiểm tra giá trị số có bằng 0 hay không, cách sau thường rõ hơn:

```java
value.compareTo(BigDecimal.ZERO) == 0
```

vì `0.00` không `equals(BigDecimal.ZERO)` nhưng về mặt số học vẫn bằng 0.
