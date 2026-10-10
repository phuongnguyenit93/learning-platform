### HOW does error appear?

```text
mathematical exact result
        ↓
nearest representable binary value
        ↓
next operation
        ↓
round again
```

For ordinary finite results inside the representable range, arithmetic generally maps the mathematical result to a nearby representable floating-point value according to IEEE 754/Java rounding semantics.

Not every out-of-range result merely becomes another finite approximation:

```text
magnitude too large
→ overflow
→ may become +Infinity / -Infinity

magnitude too small
→ underflow
→ may become a subnormal value or signed zero
```

Small errors can accumulate:

```java
double total = 0.0;
for (int i = 0; i < 10; i++) {
    total += 0.1;
}
System.out.println(total);
```

Floating-point arithmetic is also not always associative in the mathematical sense:

```java
double a = 1e16;
double b = -1e16;
double c = 1.0;

System.out.println((a + b) + c);
System.out.println(a + (b + c));
```

`double` is often appropriate for measurements, statistics, graphics, scientific computation, and simulation where a tolerance is explicit. It is often the wrong representation when exact decimal behavior is itself part of the domain contract.
