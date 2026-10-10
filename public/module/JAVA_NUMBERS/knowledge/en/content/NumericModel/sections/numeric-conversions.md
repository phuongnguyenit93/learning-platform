### Operation type is decided before assignment

Before arithmetic runs, Java applies conversion and numeric-promotion rules.

Small integer types are usually promoted to `int`:

```java
byte a = 10;
byte b = 20;

int result = a + b;
// byte invalid = a + b; // compile error
```

Mixed expressions are promoted according to language rules:

```java
int i = 10;
long l = 20L;
double d = 1.5;

long x = i + l;
double y = l + d;
```

### Pitfall: a wider assignment target does not rescue an earlier overflow

```java
int quantity = 1_000_000;
int price = 10_000;

long wrong = quantity * price;
```

The real flow is:

```text
int * int
    ↓
arithmetic runs as int
    ↓
overflow may happen
    ↓
the already-wrong int result
    ↓
is converted to long
```

Widen before the arithmetic if the operation must run as `long`:

```java
long correct = (long) quantity * price;
```

### Casting cannot restore lost information

Once overflow or floating-point rounding has happened, a later cast or wrapper type cannot reconstruct the original mathematical intent.

The next chapter starts with the easiest integer failure to miss: **overflow that allows execution to continue**.
