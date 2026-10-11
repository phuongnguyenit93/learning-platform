### WHAT

IEEE 754 floating point can be viewed as:

```text
sign
 + exponent
 + significand
```

`float` uses binary32 and `double` uses binary64. In ordinary Java application code, `double` is usually the default floating-point choice because it offers greater range and precision.

### WHY does 0.1 not fit exactly?

Some fractions that terminate in base 10 repeat forever in base 2:

```text
0.5 decimal
→ 0.1 binary
→ finite representation

0.1 decimal
→ repeating binary fraction
→ nearest representable value is stored
```

```java
double x = 0.1 + 0.2;
System.out.println(x); // 0.30000000000000004
```

This is a property of finite binary floating point, not a Java-specific bug.
