When String concatenation applies, Java produces a String value containing the combined content.

```java
String message = "Hello " + name;
```

Existing String objects are not mutated.

### String conversion happens inside the expression

Concatenation can accept primitive and reference values:

```java
String message = "count=" + 42;       // "count=42"
String flag = "active=" + true;       // "active=true"
Object value = null;
String text = "value=" + value;       // "value=null"
```

Java performs the required string conversion; application code does not need to call `toString()` for every operand.

That convenience can also hide a bug. If `null` is an invalid domain state, validate it rather than allowing concatenation to quietly turn it into the text `"null"`.

Evaluation order matters in mixed numeric/String expressions:

Operands are evaluated left to right. Numeric addition can therefore happen before the expression enters String-concatenation mode.

Avoid packing complex side effects into one concatenation expression; separate steps are easier to reason about and debug.

```java
System.out.println(1 + 2 + "x"); // "3x"
System.out.println("x" + 1 + 2); // "x12"
```
