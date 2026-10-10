Precedence determines how an expression groups; evaluation order determines when operands are evaluated.

Java specifies left-to-right operand evaluation in many expression contexts, but complex side effects still make code difficult to reason about.

Use parentheses or smaller statements when understanding intent requires memorizing a long precedence table.

Precedence, associativity, and evaluation order are separate concepts:

```java
int result = 2 + 3 * 4; // 14
int left = 20 / 5 / 2;  // 2 through left associativity
```

Prefix/postfix increment also differ in the expression value they produce:

```java
int i = 1;
int a = i++; // a=1, i=2
int b = ++i; // i=3, b=3
```

For equality, primitive `==` compares primitive values after applicable conversions; reference `==` compares identity/reference relationships rather than domain value equality.

The next chapter moves from implicit conversions in expressions to explicit casting.
